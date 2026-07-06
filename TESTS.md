# Tests

Unit tests run with [Jest](https://jestjs.io/) (via `next/jest`).

## Run the suite

```bash
npm test           # run all tests once
npm run test:watch # re-run on file changes
```

## Write a test

1. Create a file under `tests/`, mirroring the path of the code it covers.
   Example: code in `src/lib/utils.js` → test in `tests/lib/utils.test.js`.
2. Name it `*.test.js` (Jest auto-discovers these).
3. Import the code using the `@/` alias (`@/` → `src/`).

```js
import { sum } from '@/lib/utils'

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })
})
```

`describe` groups related tests, `it` is a single case, `expect(...).toBe(...)` asserts the result.
