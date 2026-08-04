# DynamoDB Mock
This is a relatively simple wrapper around
[dynalite](https://github.com/mhart/dynalite) to make it easier to use in a test
environment. Requests are intercepted with [msw](https://mswjs.io/), so no
actual server or port is used.

[![npm](https://img.shields.io/npm/v/@labdigital/mock-dynamodb.svg)](https://www.npmjs.com/package/@labdigital/mock-dynamodb)

## Usage
This package provides msw request handlers, the msw server itself is managed by
your own test setup. Pass the handlers to `setupServer()` so that they survive
`server.resetHandlers()`:

```typescript
import { mockDynamoDB } from "@labdigital/mock-dynamodb";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

export const mddb = mockDynamoDB({ endpoint: "http://localhost:4000" });
export const server = setupServer(...mddb.getHandlers());

const client = new DynamoDB({
	endpoint: "http://localhost:4000",
	region: "local",
	credentials: {
		accessKeyId: "fake-x",
		secretAccessKey: "fake",
	},
});

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => mddb.reset()); // Clear all data
afterAll(() => server.close());
```

Every `accessKeyId` gets its own store, so tests using different credentials
don't see each other's data. `reset()` clears the data of all of them.

If you need to bind to a server that is already running, use
`registerHandlers()` instead. Note that those handlers are removed again by
`server.resetHandlers()`, so they have to be registered per test:

```typescript
beforeEach(() => mddb.registerHandlers(server));
```

### Combining with other mocks
Use a single msw server for all of your mocks, running more than one server per
process is not supported by msw:

```typescript
const server = setupServer(...ctMock.getHandlers(), ...mddb.getHandlers());
```

## Migrating from 0.2.x
Version 0.3.0 replaced [nock](https://github.com/nock/nock) with msw, which
means this package no longer starts an interceptor of its own. `msw` is a peer
dependency now and has to be installed alongside it.

```diff
 const mddb = mockDynamoDB({ endpoint: "http://localhost:4000" });
+const server = setupServer(...mddb.getHandlers());
+server.listen();

 mddb.reset();
-mddb.stop();
+server.close();
```

`start()` and `stop()` throw an error pointing at the above, they are removed
in 1.0.
