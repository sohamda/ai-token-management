---
paths:
  - "src/test/java/**/*.java"
---

# Test conventions

Loaded only when Claude reads or edits a file under `src/test/java/`.

- JUnit 5 (`org.junit.jupiter.api.Test`) and AssertJ (`assertThat`). No Mockito, no TestNG.
- One test class per source class: `<ClassName>Test.java`, same package as the class under test.
- One `@Test` method per behaviour, named `doesX_whenY`.
- Run a single class with `mvn test -Dtest=<ClassName>Test` before running the full suite.
