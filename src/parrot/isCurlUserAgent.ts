/**
 * User-Agent ヘッダが curl からのリクエストかを判定する。
 * 大文字小文字を区別せず、文字列中に `curl` を含むかを見る。
 * parrot.live はこの判定でブラウザからのアクセスを GitHub にリダイレクトしている。
 *
 * @param userAgent リクエストの User-Agent ヘッダ。未設定の場合は `null`
 * @returns curl 互換クライアントとみなせる場合に true
 */
export function isCurlUserAgent(userAgent: string | null): boolean {
	if (userAgent === null) {
		// User-Agent 未設定のリクエストは curl 等の素朴なクライアントとみなしてアニメーションを返す。
		// parrot.live も `headers['user-agent']` が無い場合はリダイレクトしない挙動。
		return true
	}
	return userAgent.toLowerCase().includes('curl')
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('isCurlUserAgent', () => {
		it('curl の User-Agent は true', () => {
			expect(isCurlUserAgent('curl/8.4.0')).toBe(true)
		})

		it('大文字 CURL でも true', () => {
			expect(isCurlUserAgent('CURL/8.4.0')).toBe(true)
		})

		it('ブラウザの User-Agent は false', () => {
			expect(
				isCurlUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
			).toBe(false)
		})

		it('null は true (User-Agent 未設定)', () => {
			expect(isCurlUserAgent(null)).toBe(true)
		})
	})
}
