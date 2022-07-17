process.env.AWS_ACCESS_KEY_ID = `AKIAIOSFODNN7EXAMPLE`;
process.env.AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
process.env.AWS_S3_BUCKET = "AWS_S3_BUCKET";
process.env.AWS_REGION = "us-east-1";

const distFolder = "/mocks/_dist";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(`${process.cwd()}${distFolder}/browser/package.json`);
const packageName = packageJson.name;
const version = packageJson.version;

const sendS3 = jest.fn();

jest.mock("@aws-sdk/client-s3", () => ({
  ...jest.requireActual("@aws-sdk/client-s3"),
  S3Client: () => ({ send: sendS3 }),
}));

describe("deploy micro-frontend", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {
      // do nothing
    });
    jest.spyOn(process, "exit").mockImplementation();
  });

  afterEach(() => {
    jest.resetModules();
    jest.unmock("./cloudfront-functions/deploy");
  });

  describe("if no CloudFront Id", () => {
    it("uploads build to an S3 bucket without deploying a CloudFront Function", async () => {
      const remoteBasename = `/${packageName}/${version}`;
      const deployFunction = jest.fn();
      jest.doMock("./cloudfront-functions/deploy", () => ({
        deployFunction,
      }));
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { deploy } = require("./index");

      await deploy({
        remoteBasename,
        packageName,
        version,
        distFolder,
      });

      expect(process.exit).not.toHaveBeenCalled();
      expect(deployFunction).not.toHaveBeenCalled();
    });
  });

  describe("if CloudFront Id", () => {
    it("uploads build to an S3 bucket and updates an existing CloudFront Function if an existing Function is found", async () => {
      process.env.CLOUDFRONT_DISTRIBUTION_ID = "EDFDVBD6EXAMPLE";
      const remoteBasename = `/${packageName}/${version}`;
      const ETag = Math.random().toString();
      const destroyCloudFrontClient = jest.fn();
      const attachFunctionToDistribution = jest.fn();
      const publishFunction = jest.fn();

      jest.doMock("@aws-sdk/client-cloudfront", () => ({
        ...jest.requireActual("@aws-sdk/client-cloudfront"),
        CloudFrontClient: () => ({
          send: () => ({
            ETag,
            $metadata: { httpStatusCode: 200 },
          }),
          destroy: destroyCloudFrontClient,
        }),
      }));

      jest.doMock("./cloudfront-functions/utils", () => ({
        ...jest.requireActual("./cloudfront-functions/utils"),
        getFunction: () =>
          Promise.resolve({
            ETag,
          }),
        attachFunctionToDistribution,
        publishFunction,
      }));

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { deploy } = require("./index");

      await deploy({
        remoteBasename,
        packageName,
        version,
        distFolder,
      });

      expect(process.exit).not.toHaveBeenCalled();
      expect(destroyCloudFrontClient).toHaveBeenCalled();
      expect(attachFunctionToDistribution).not.toHaveBeenCalled();
      expect(publishFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          ETag,
          Name: "_test_package_name_latest",
        })
      );
    });

    it("uploads build to an S3 bucket and creates a new CloudFront Function if no existing Function is found", async () => {
      process.env.CLOUDFRONT_DISTRIBUTION_ID = Math.random().toString();
      const remoteBasename = `/${packageName}/${version}`;
      const ETag = Math.random().toString();
      const FunctionARN = Math.random().toString();
      const destroyCloudFrontClient = jest.fn();
      const attachFunctionToDistribution = jest.fn();
      const publishFunction = jest.fn();

      jest.doMock("@aws-sdk/client-cloudfront", () => ({
        ...jest.requireActual("@aws-sdk/client-cloudfront"),
        CloudFrontClient: () => ({
          send: () => ({
            ETag,
            $metadata: { httpStatusCode: 200 },
            FunctionSummary: {
              FunctionMetadata: { FunctionARN },
            },
          }),
          destroy: destroyCloudFrontClient,
        }),
      }));

      jest.doMock("./cloudfront-functions/utils", () => ({
        ...jest.requireActual("./cloudfront-functions/utils"),
        getFunction: () =>
          Promise.resolve({
            ETag: undefined,
          }),
        attachFunctionToDistribution,
        publishFunction,
      }));

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { deploy } = require("./index");

      await deploy({
        remoteBasename,
        packageName,
        version,
        distFolder,
      });

      expect(process.exit).not.toHaveBeenCalled();
      expect(destroyCloudFrontClient).toHaveBeenCalled();
      expect(attachFunctionToDistribution).toHaveBeenCalledWith(
        expect.objectContaining({
          FunctionARN,
          cloudFrontDistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
        })
      );
      expect(publishFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          ETag,
          Name: "_test_package_name_latest",
        })
      );
    });
  });
});
