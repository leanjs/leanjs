import {
  CloudFrontClient,
  CreateFunctionCommand,
  FunctionRuntime,
  UpdateFunctionCommand,
} from "@aws-sdk/client-cloudfront";

import {
  getFunction,
  attachFunctionToDistribution,
  publishFunction,
} from "./utils";

interface DeployFunctionArgs {
  runtime?: FunctionRuntime;
  comment: string;
  name: string;
  region: string;
  functionCode: string;
  cloudFrontDistributionId: string;
  pathPattern: string;
  targetOriginId: string;
}

export async function deployFunction({
  runtime: Runtime = FunctionRuntime.cloudfront_js_1_0,
  comment: Comment,
  name: Name,
  region,
  functionCode,
  cloudFrontDistributionId,
  pathPattern,
  targetOriginId,
}: DeployFunctionArgs) {
  const client = new CloudFrontClient({ region });
  const FunctionCode = new TextEncoder().encode(functionCode);

  try {
    const fnResponse = await getFunction({ Name, client });

    if (fnResponse?.ETag) {
      const updatedFunctonResp = await client.send(
        new UpdateFunctionCommand({
          Name,
          IfMatch: fnResponse.ETag,
          FunctionConfig: {
            Comment,
            Runtime,
          },
          FunctionCode,
        })
      );

      if (!updatedFunctonResp?.ETag) {
        throw new Error(`Updating function ${Name} returned undefined ETag`);
      }
      console.log(`Function found and updated`);

      await publishFunction({ ETag: updatedFunctonResp?.ETag, Name, client });
    } else {
      console.log(`Function not found, creating it`);
      const { ETag, FunctionSummary } = await client.send(
        new CreateFunctionCommand({
          Name,
          FunctionConfig: {
            Comment,
            Runtime,
          },
          FunctionCode,
        })
      );
      const FunctionARN = FunctionSummary?.FunctionMetadata?.FunctionARN;
      if (!ETag || !FunctionARN) {
        throw new Error(
          `Invalid ETag (value:${ETag}) or FunctionARN (value:${FunctionARN}) after creating function ${Name}`
        );
      }

      console.log(`Publishing CloufFront Function ${Name}`);
      await publishFunction({ ETag, Name, client });

      console.log(
        `Attaching function ${Name} to CloudFront distribution id ${cloudFrontDistributionId}`
      );
      await attachFunctionToDistribution({
        FunctionARN,
        cloudFrontDistributionId,
        client,
        pathPattern,
        targetOriginId,
      });
    }
  } catch (error: unknown) {
    console.log(`🔥 Error deploying function`, error as Error);
  } finally {
    client.destroy();
  }
}
