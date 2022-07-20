import type { CloudFrontClient } from "@aws-sdk/client-cloudfront";

import {
  getFunction,
  attachFunctionToDistribution,
  publishFunction,
} from "./utils";

describe("CloudFront Functions", () => {
  describe("Utils", () => {
    describe("getFunction", () => {
      it("returns a response if it finds a Function", async () => {
        const fakeFunction = Math.random();
        const send = jest.fn(() => Promise.resolve(fakeFunction));
        const client = { send } as unknown as CloudFrontClient;
        const Name = Math.random().toString();

        const response = await getFunction({
          Name,
          client,
        });

        expect(response).toBe(fakeFunction);
      });

      it("returns undefined if it doesn't find a Function", async () => {
        const send = jest.fn(() => Promise.reject("NoSuchFunctionExists"));
        const client = { send } as unknown as CloudFrontClient;
        const Name = Math.random().toString();

        const response = await getFunction({
          Name,
          client,
        });

        expect(response).toBe(undefined);
      });

      it("throws an error if the request fails", async () => {
        const errorMessage = Math.random().toString();
        const send = jest.fn(() => Promise.reject(errorMessage));
        const client = { send } as unknown as CloudFrontClient;
        const Name = Math.random().toString();

        let error;
        try {
          await getFunction({
            Name,
            client,
          });
        } catch (err) {
          error = err;
        }

        expect(error).toBe(errorMessage);
      });
    });

    describe("attachFunctionToDistribution", () => {
      it("returns a new distribution ETag if it attaches the Function to a Distribution", async () => {
        const FunctionARN = Math.random().toString();
        const cloudFrontDistributionId = Math.random().toString();
        const Distribution = Math.random().toString();
        const ETag = Math.random().toString();
        const send = jest.fn(() =>
          Promise.resolve({
            Distribution,
            ETag,
            $metadata: { httpStatusCode: 200 },
          })
        );
        const client = { send } as unknown as CloudFrontClient;

        const response = await attachFunctionToDistribution({
          FunctionARN,
          cloudFrontDistributionId,
          client,
        });

        expect(response).toBe(ETag);
      });

      it("throws an error if it doesn't find a distribution", async () => {
        const FunctionARN = Math.random().toString();
        const cloudFrontDistributionId = Math.random().toString();
        const ETag = Math.random().toString();
        const send = jest.fn(() =>
          Promise.resolve({
            Distribution: undefined,
          })
        );
        const client = { send } as unknown as CloudFrontClient;

        let error: Error | undefined = undefined;
        try {
          await attachFunctionToDistribution({
            FunctionARN,
            cloudFrontDistributionId,
            client,
          });
        } catch (err) {
          error = err as Error;
        }

        expect(error?.message).toBe(
          `Failed to get distribution id ${cloudFrontDistributionId}`
        );
      });

      it("throws an error if the client returns a status code different than 200", async () => {
        const FunctionARN = Math.random().toString();
        const cloudFrontDistributionId = Math.random().toString();
        const Distribution = Math.random().toString();
        const ETag = Math.random().toString();
        const send = jest.fn(() =>
          Promise.resolve({
            Distribution,
            ETag,
            $metadata: { httpStatusCode: 500 },
          })
        );
        const client = { send } as unknown as CloudFrontClient;

        let error: Error | undefined = undefined;
        try {
          await attachFunctionToDistribution({
            FunctionARN,
            cloudFrontDistributionId,
            client,
          });
        } catch (err) {
          error = err as Error;
        }

        expect(error?.message).toBe(
          `Failed to update CloudFront distribution id: ${cloudFrontDistributionId}`
        );
      });
    });

    describe("publishFunction", () => {
      it("throws an error if the client returns a status code different than 200", async () => {
        const Name = Math.random().toString();
        const ETag = Math.random().toString();
        const send = jest.fn(() =>
          Promise.resolve({
            $metadata: { httpStatusCode: 500 },
          })
        );
        const client = { send } as unknown as CloudFrontClient;

        let error: Error | undefined = undefined;
        try {
          await publishFunction({
            ETag,
            Name,
            client,
          });
        } catch (err) {
          error = err as Error;
        }

        expect(error?.message).toBe(
          `Failed to publish function. HTTP status code: 500`
        );
      });

      it("doesn't throw an error if it publishes the Function", async () => {
        const Name = Math.random().toString();
        const ETag = Math.random().toString();
        const send = jest.fn(() =>
          Promise.resolve({
            $metadata: { httpStatusCode: 200 },
          })
        );
        const client = { send } as unknown as CloudFrontClient;

        let error: Error | undefined = undefined;
        try {
          await publishFunction({
            ETag,
            Name,
            client,
          });
        } catch (err) {
          error = err as Error;
        }

        expect(error).toBeFalsy();
      });
    });
  });
});
