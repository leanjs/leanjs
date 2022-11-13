import {
  CloudFrontClient,
  GetFunctionCommand,
  PublishFunctionCommand,
  UpdateDistributionCommand,
  GetDistributionCommand,
} from "@aws-sdk/client-cloudfront";

export async function getFunction({
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
  } catch (error: unknown) {
    const message = (error as Error).toString();
    if (!message.includes("NoSuchFunctionExists")) {
      throw error;
    }
  }

  return fnResponse;
}

export async function attachFunctionToDistribution({
  FunctionARN,
  cloudFrontDistributionId,
  client,
  pathPattern,
  targetOriginId,
}: {
  cloudFrontDistributionId: string;
  FunctionARN: string;
  client: CloudFrontClient;
  pathPattern: string;
  targetOriginId: string;
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

  if (
    !Distribution.DistributionConfig?.CacheBehaviors?.Items?.find(
      (item) => item.PathPattern === pathPattern
    )
  ) {
    Distribution.DistributionConfig?.CacheBehaviors?.Items?.push({
      PathPattern: pathPattern,
      TargetOriginId: targetOriginId,
      ViewerProtocolPolicy: "redirect-to-https",
      FunctionAssociations: {
        Quantity: 1,
        Items: [
          {
            FunctionARN,
            EventType: "viewer-request",
          },
        ],
      },
    });
  }

  const { $metadata, ETag: UpdatedETag } = await client.send(
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

  return UpdatedETag;
}

export async function publishFunction({
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
