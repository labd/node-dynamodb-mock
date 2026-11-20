---
"@labdigital/mock-dynamodb": patch
---

Load the package without the native `classic-level` build. The bundled dynalite no longer loads `level`, which threw "No native build was found" on import, because the mock only uses in-memory storage.
