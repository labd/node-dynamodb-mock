# DynamoDB Mock
This is a relatively simple wrapper around
[dynalite](https://github.com/mhart/dynalite) to make it easier to use in a test
environment.

[![npm](https://img.shields.io/npm/v/@labdigital/mock-dynamodb.svg)](https://www.npmjs.com/package/@labdigital/mock-dynamodb)

## Usage
```typescript

import { mockDynamoDB } from "@labdigital/mock-dynamodb";

const mddb = mockDynamoDB({ endpoint: "http://localhost:4000" });
const client = new DynamoDB({
	endpoint: "http://localhost:4000",
	region: "local",
	credentials: {
		accessKeyId: "fake-x",
		secretAccessKey: "fake",
	},
});

mddb.reset(); // Clear all data

mddb.stop(); // Stop the server
```
