const nextJest = require('next/jest')

// Provide the path to the Next.js app so next/jest can load next.config and .env files.
const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const config = {
  // Use jsdom so component tests can render into a DOM later on.
  testEnvironment: 'jest-environment-jsdom',
  // Map the "@/..." alias so tests resolve imports the same way the app does.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(config)
