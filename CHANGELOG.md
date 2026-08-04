# @labdigital/mock-dynamodb

## 0.3.0

### Minor Changes

- ef2b7e8: Replace nock with msw request handlers (breaking)

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

### Patch Changes

- cd1f181: update dependencies

## 0.2.2

### Patch Changes

- a4e085b: Migrate toolchain: tsup to tsdown, ESLint to Biome 2.x, update all dependencies

## 0.2.1

### Patch Changes

- e81ccf8: Fix packaging issues

## 0.2.0

### Minor Changes

- ac39e5e: Use a separate store for every unique access key id
- ac39e5e: Refactor the API to return an instance to stop/start/reset the stores

### Patch Changes

- 4cc8c67: Add types to the package.json
- 2a7d4dc: Bundle dynalite in the dist

## 0.1.0

### Minor Changes

- adc485d: Initial working release

## 0.0.2

### Patch Changes

- 1ae48aa: Initial release
