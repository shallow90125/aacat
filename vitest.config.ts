import { defineConfig } from 'vitest/config'

export default defineConfig({
	define: {
		// 本番ビルド時 (wrangler) では `import.meta.vitest` が undefined になり、関連コードが tree-shake される。
		'import.meta.vitest': 'undefined',
	},
	test: {
		// 各実装ファイル内の `if (import.meta.vitest)` ブロックをテストとして拾う in-source testing 設定。
		includeSource: ['src/**/*.ts'],
	},
})
