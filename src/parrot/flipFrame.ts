/**
 * フレーム文字列を文字単位で反転する。
 * `?flip=true` クエリで鏡像のパロットを表示するために使う。
 * parrot.live と挙動を揃えるため、行単位ではなく文字列全体を反転する。
 *
 * @param frame 反転対象のフレーム文字列
 * @returns 文字単位で反転したフレーム文字列
 */
export function flipFrame(frame: string): string {
	return frame.split('').reverse().join('')
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('flipFrame', () => {
		it('文字列を文字単位で反転する', () => {
			expect(flipFrame('abc')).toBe('cba')
		})

		it('空文字列は空文字列を返す', () => {
			expect(flipFrame('')).toBe('')
		})

		it('改行も含めて反転される', () => {
			expect(flipFrame('ab\ncd')).toBe('dc\nba')
		})
	})
}
