beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {
    // do nothing
  });
});

afterEach(() => {
  jest.resetModules();
  jest.unmock("@aws-sdk/client-s3");
});

describe("upload-to-s3", () => {
  const distFolder = "/mocks/_dist";
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(`${process.cwd()}${distFolder}/browser/package.json`);
  const packageName = packageJson.name;
  const version = packageJson.version;

  it("should batch requests", async () => {
    const region = "us-east-1";
    const remoteBasename = `/${packageName}/${version}`;
    const bucket = "bucket_name";
    const batchLimit = 1;

    jest.doMock("@aws-sdk/client-s3", () => ({
      ...jest.requireActual("@aws-sdk/client-s3"),
      S3Client: () => ({
        send: () => {
          // empty
        },
      }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { uploadFolder } = require("./upload-to-s3");

    const batches = await uploadFolder({
      remoteBasename,
      distFolder,
      bucket,
      region,
      batchLimit,
    });

    expect(batches).toBe(3);
  });

  it("should catch errors", async () => {
    const region = "us-east-1";
    const remoteBasename = `/${packageName}/${version}`;
    const bucket = "bucket_name";
    const batchLimit = 1;
    const exitError = jest.fn();

    jest.doMock("@leanjs/cli", () => ({
      ...jest.requireActual("@leanjs/cli"),
      exitError,
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { uploadFolder } = require("./upload-to-s3");

    await uploadFolder({
      remoteBasename,
      distFolder,
      bucket,
      region,
      batchLimit,
    });

    expect(exitError).toBeCalled();
  });
});
