import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { mockDynamoDB } from "./index.js";

const mddb = mockDynamoDB({ endpoint: "http://localhost:4000" });
const server = setupServer(...mddb.getHandlers());

const client = new DynamoDB({
	endpoint: "http://localhost:4000",
	region: "local",
	credentials: {
		accessKeyId: "fake-x",
		secretAccessKey: "fake",
	},
});

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
	// Handlers passed to setupServer() survive resetHandlers()
	server.resetHandlers();
	mddb.reset();
});

afterAll(() => {
	server.close();
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
		}),
	).rejects.toThrow("Requested resource not found");
});

test("writes to a table right after creating it", async () => {
	await client.createTable({
		TableName: "Music",
		KeySchema: [{ AttributeName: "Artist", KeyType: "HASH" }],
		AttributeDefinitions: [{ AttributeName: "Artist", AttributeType: "S" }],
		BillingMode: "PAY_PER_REQUEST",
	});

	// No waitUntilTableExists() in between, the table has to be usable as soon
	// as createTable() resolves
	await client.putItem({
		TableName: "Music",
		Item: { Artist: { S: "No One You Know" } },
	});

	const item = await client.getItem({
		TableName: "Music",
		Key: { Artist: { S: "No One You Know" } },
	});
	expect(item.Item).toEqual({ Artist: { S: "No One You Know" } });
});

test("keeps a separate store per accessKeyId", async () => {
	const otherClient = new DynamoDB({
		endpoint: "http://localhost:4000",
		region: "local",
		credentials: { accessKeyId: "fake-y", secretAccessKey: "fake" },
	});

	await client.createTable({
		TableName: "Music",
		KeySchema: [{ AttributeName: "Artist", KeyType: "HASH" }],
		AttributeDefinitions: [{ AttributeName: "Artist", AttributeType: "S" }],
		BillingMode: "PAY_PER_REQUEST",
	});

	expect((await client.listTables({})).TableNames).toEqual(["Music"]);
	expect((await otherClient.listTables({})).TableNames).toEqual([]);
});

test("registerHandlers binds to an already running server", async () => {
	const other = mockDynamoDB({ endpoint: "http://localhost:4001" });
	other.registerHandlers(server);

	const otherClient = new DynamoDB({
		endpoint: "http://localhost:4001",
		region: "local",
		credentials: { accessKeyId: "fake-x", secretAccessKey: "fake" },
	});

	expect((await otherClient.listTables({})).TableNames).toEqual([]);
});

test("start and stop point at the msw setup", () => {
	expect(() => mddb.start()).toThrow("setupServer(...mock.getHandlers())");
	expect(() => mddb.stop()).toThrow("close your own msw server");
});
