import { expect, test } from "vitest";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { MockDynamoDB } from "./index.js";

const m = new MockDynamoDB();
m.start();
const client = new DynamoDB({
  endpoint: "http://localhost:4000",
  region: "local",
  credentials: {
    accessKeyId: "fake",
    secretAccessKey: "fake",
  },
});

test("createTables", async () => {
  await client.createTable({
    TableName: "Music",
    KeySchema: [
      {
        AttributeName: "Artist",
        KeyType: "HASH", //Partition key
      },
      {
        AttributeName: "SongTitle",
        KeyType: "RANGE", //Sort key
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "Artist",
        AttributeType: "S",
      },
      {
        AttributeName: "SongTitle",
        AttributeType: "S",
      },
    ],
    ProvisionedThroughput: {
      // Only specified if using provisioned mode
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  const tables = await client.listTables({});
  expect(tables.TableNames).toEqual(["Music"]);
});
