const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");

module.exports.createInvalidation = async ({
  distributionId,
  path,
  region,
}) => {
  const client = new CloudFrontClient({ region });

  const params = {
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: new Date().toISOString(),
      Paths: {
        Quantity: 1,
        Items: [path],
      },
    },
  };

  const createInvalidationCommand = new CreateInvalidationCommand(params);

  const response = await client.send(createInvalidationCommand);

  console.log("Posted CloudFront invalidation, response:");
  console.log(response);
};
