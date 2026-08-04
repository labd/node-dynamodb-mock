---
"@labdigital/mock-dynamodb": minor
---

Replace nock with msw request handlers (breaking)

This mock no longer runs an interceptor of its own. Instead it exposes msw
request handlers that are registered on the msw server owned by your test
suite, which avoids two libraries fighting over request interception. `msw` is
a peer dependency now.

```diff
 const mddb = mockDynamoDB({ endpoint: "http://localhost:4000" });
+const server = setupServer(...mddb.getHandlers());
+server.listen();

 mddb.reset();
-mddb.stop();
+server.close();
```

`start()` and `stop()` throw an error pointing at the new setup, they are
removed in 1.0. Table lifecycle actions now wait for the table to reach its
settled state before responding, so a table can be written to immediately
after `createTable()` resolves.
