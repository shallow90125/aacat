import { CLEAR_SCREEN, type ParrotColor } from './colors'
import { colorize } from './colorize'

/**
 * 1 フレーム分の出力文字列を組み立てる。
 * 画面クリアシーケンスの後ろに、指定色で着色したフレームを連結する。
 *
 * @param frame 出力するフレーム本文 (改行を含む)
 * @param color 着色に使う色名
 * @returns curl に流すための完成された文字列
 */
export function buildFrameOutput(frame: string, color: ParrotColor): string {
	return `${CLEAR_SCREEN}${colorize(frame, color)}`
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('buildFrameOutput', () => {
		it('クリアシーケンスに続いて色付きフレームを返す', () => {
			const output = buildFrameOutput('AAA', 'red')
			expect(output).toBe('\x1b[2J\x1b[3J\x1b[H\x1b[31mAAA\x1b[0m')
		})

		it('クリアシーケンスで始まる', () => {
			expect(buildFrameOutput('X', 'blue').startsWith('\x1b[2J\x1b[3J\x1b[H')).toBe(true)
		})
	})
}
