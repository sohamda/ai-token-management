---
applyTo: "src/**/*.java"
---

# Test conventions for src/

When writing or editing tests in `src/test/java/`:

- Use JUnit 5 (`@Test` from `org.junit.jupiter.api`) and AssertJ for assertions.
- Test classes live under `src/test/java/` mirroring the main source tree.
- One test class per source class, named `<ClassName>Test.java`.
- One `@Test` method per behavior.
- Avoid mocks unless absolutely required.
- No external test frameworks (no Mockito, TestNG, etc.) unless strictly necessary.

Example skeleton:

```java
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class ThingTest {

    @Test
    void doesX_whenY() {
        assertThat(new Thing().compute(1)).isEqualTo(2);
    }
}
```
