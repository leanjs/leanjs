import {
  CloudFrontClient,
  CreateFunctionCommand,
  FunctionRuntime,
  GetFunctionCommand,
  PublishFunctionCommand,
  UpdateDistributionCommand,
  GetDistributionCommand,
  UpdateFunctionCommand,
} from "@aws-sdk/client-cloudfront";

interface DeployFunctionArgs {
  runtime?: FunctionRuntime;
  comment: string;
  name: string;
  region: string;
  functionCode: string;
  cloudFrontDistributionId: string;
}

export async function deployFunction({
  runtime: Runtime = FunctionRuntime.cloudfront_js_1_0,
  comment: Comment,
  name: Name,
  region,
  functionCode,
  cloudFrontDistributionId,
}: DeployFunctionArgs) {
  const client = new CloudFrontClient({ region });
  const FunctionCode = new TextEncoder().encode(functionCode);

  try {
    console.log(`Getting CloufFront Function ${Name}`);
    const fnResponse = await getFunction({ Name, client });
    if (fnResponse?.ETag) {
      await client.send(
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
      console.log(`Function found and updated`);
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
      });
    }
  } catch (error: unknown) {
    console.log(`🔥 Error deploying function`, error as Error);
  } finally {
    client.destroy();
  }
}

async function attachFunctionToDistribution({
  FunctionARN,
  cloudFrontDistributionId,
  client,
}: {
  cloudFrontDistributionId: string;
  FunctionARN: string;
  client: CloudFrontClient;
}) {
  const { Distribution, ETag } = await client.send(
    new GetDistributionCommand({
      Id: cloudFrontDistributionId,
    })
  );

  if (!Distribution) {
    throw new Error(
      `Failed to get distribution id ${cloudFrontDistributionId}`
    );
  }

  Distribution.DistributionConfig?.DefaultCacheBehavior?.FunctionAssociations?.Items?.push(
    {
      FunctionARN,
      EventType: "viewer-request",
    }
  );

  const { $metadata } = await client.send(
    new UpdateDistributionCommand({
      ...Distribution,
      IfMatch: ETag,
    })
  );

  if ($metadata.httpStatusCode !== 200) {
    throw new Error(
      `Failed to update CloudFront distribution id: ${cloudFrontDistributionId}`
    );
  }
}

async function publishFunction({
  ETag,
  Name,
  client,
}: {
  ETag: string;
  Name: string;
  client: CloudFrontClient;
}) {
  const { $metadata } = await client.send(
    new PublishFunctionCommand({
      Name,
      IfMatch: ETag,
    })
  );

  if ($metadata.httpStatusCode !== 200) {
    throw new Error(
      `Failed to publish function. HTTP status code: ${$metadata.httpStatusCode}`
    );
  }
}

async function getFunction({
  Name,
  client,
}: {
  Name: string;
  client: CloudFrontClient;
}) {
  let fnResponse;
  try {
    fnResponse = await client.send(
      new GetFunctionCommand({
        Name,
      })
    );
  } catch (error: any) {
    const message = error.toString();
    if (!message.includes("NoSuchFunctionExists")) {
      throw error;
    }
  }

  return fnResponse;
}
