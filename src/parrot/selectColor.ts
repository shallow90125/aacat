/**
 * 直前の色インデックスと異なる色インデックスを 1 つ抽選する。
 * 抽選には呼び出し側が渡す乱数生成関数を使うため、テスト時に決定的な値を注入できる。
 *
 * @param previousColor 直前に選ばれた色インデックス。初回呼び出しなど存在しない場合は -1 を渡す
 * @param totalColors カラーパレットの要素数 (>= 2 であること)
 * @param random `[0, 1)` の値を返す乱数生成関数
 * @returns 直前の色とは必ず異なる `[0, totalColors)` の整数
 */
export function selectColor(
	previousColor: number,
	totalColors: number,
	random: () => number,
): number {
	let next = Math.floor(random() * totalColors)
	while (next === previousColor) {
		next = Math.floor(random() * totalColors)
	}
	return next
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('selectColor', () => {
		it('直前の色と異なる色を返す', () => {
			let r = 0
			const seq = [0.1, 0.5, 0.9]
			const random = () => seq[r++ % seq.length]
			expect(selectColor(0, 7, random)).not.toBe(0)
		})

		it('乱数が直前と同じ色を選んだ場合は再抽選する', () => {
			// 7 色のうちインデックス 3 を直前としたうえで、最初の乱数も 3 を選ぶように仕込む。
			// seq の 1 つ目で 3 が出るが previous と一致するため、2 つ目の値 (=> 5) が採用されるはず。
			const seq = [3 / 7, 5 / 7]
			let r = 0
			const random = () => seq[r++]
			expect(selectColor(3, 7, random)).toBe(5)
		})

		it('結果は 0 以上 totalColors 未満の整数になる', () => {
			const random = () => 0.9999999
			const result = selectColor(-1, 7, random)
			expect(Number.isInteger(result)).toBe(true)
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThan(7)
		})
	})
}
