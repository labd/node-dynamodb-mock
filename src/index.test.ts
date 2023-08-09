import { beforeEach, expect, test } from "vitest";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { mockDynamoDB } from "./index.js";

const mddb = mockDynamoDB({ endpoint: "http://localhost:4000" });
const client = new DynamoDB({
	endpoint: "http://localhost:4000",
	region: "local",
	credentials: {
		accessKeyId: "fake-x",
		secretAccessKey: "fake",
	},
});

beforeEach(() => {
	mddb.reset();
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

	await client.batchWriteItem({
		RequestItems: {
			Music: [
				{
					PutRequest: {
						Item: {
							Artist: { S: "No One You Know" },
							SongTitle: { S: "Call Me Today" },
						},
					},
				},
				{
					PutRequest: {
						Item: {
							Artist: { S: "No One You Know" },
							SongTitle: { S: "My Dog Spot" },
						},
					},
				},
			],
		},
	});
});

test("getItem not found", async () => {
	const tables = await client.listTables({});
	expect(tables.TableNames).toEqual([]);

	await expect(
		client.getItem({
			TableName: "Music",
			Key: {
				Artist: { S: "No One You Know" },
				SongTitle: { S: "Call Me Today" },
			},
		})
	).rejects.toThrow("Requested resource not found");
});
