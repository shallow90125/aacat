import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    // In a production build (wrangler) `import.meta.vitest` becomes `undefined`
    // so the inline tests are tree-shaken out of the worker bundle.
    'import.meta.vitest': 'undefined',
  },
  test: {
    // Enables in-source testing: each `if (import.meta.vitest)` block in src/ is collected as tests.
    includeSource: ['src/**/*.ts'],
  },
})
