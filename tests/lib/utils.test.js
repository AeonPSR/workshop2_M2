import { sum } from '@/lib/utils'

// This is the reference example for the team: a minimal unit test.
// Pattern: describe the unit under test, then assert with expect(...).
describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })
})
