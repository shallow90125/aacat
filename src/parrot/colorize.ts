import { ANSI_COLORS, ANSI_RESET, type ParrotColor } from './colors'

/**
 * テキストを指定された ANSI 色で囲む。
 * 終端に必ずリセットシーケンスを付与するため、後続のテキストへ色が漏れない。
 *
 * @param text 着色対象のテキスト
 * @param color カラーパレットに存在する色名
 * @returns ANSI エスケープシーケンスで挟まれたテキスト
 */
export function colorize(text: string, color: ParrotColor): string {
	return `${ANSI_COLORS[color]}${text}${ANSI_RESET}`
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('colorize', () => {
		it('テキストを ANSI 色エスケープで囲み末尾にリセットを付ける', () => {
			expect(colorize('hi', 'red')).toBe('\x1b[31mhi\x1b[0m')
		})

		it('空文字列でも前後にエスケープを付ける', () => {
			expect(colorize('', 'blue')).toBe('\x1b[34m\x1b[0m')
		})
	})
}
