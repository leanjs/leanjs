const { uploadFolder } = require("@leanjs/aws");
const invariant = require("invariant");
const { createInvalidation } = require("./createInvalidation");

invariant(
  process.env.AWS_SECRET_ACCESS_KEY,
  "AWS_SECRET_ACCESS_KEY is required"
);
invariant(process.env.AWS_S3_BUCKET, "AWS_S3_BUCKET is required");
invariant(process.env.AWS_ACCESS_KEY_ID, "AWS_ACCESS_KEY_ID is required");
invariant(process.env.AWS_REGION, "AWS_REGION is required");
invariant(process.env.CLOUDFRONT_DISTRIBUTION_ID, "CLOUDFRONT_DISTRIBUTION_ID");

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;
const distFolder = "dist";
const remoteBasename = "__art_boards_app";
const batchLimit = 10;

uploadFolder({ remoteBasename, distFolder, bucket, region, batchLimit });
createInvalidation({
  distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  path: `/${remoteBasename}/index.html`,
  region,
});

console.log(`Uploaded to S3 `);
