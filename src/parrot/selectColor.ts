/**
 * Pick a color index that differs from the previously chosen one.
 * The random source is injected so the caller can supply a deterministic
 * sequence in tests.
 *
 * @param previousColor index returned by the previous call, or -1 on the first call
 * @param totalColors size of the palette (must be >= 2)
 * @param random function that returns a value in `[0, 1)`
 * @returns an integer in `[0, totalColors)` that is not equal to `previousColor`
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
		it('returns a color different from the previous one', () => {
			let r = 0
			const seq = [0.1, 0.5, 0.9]
			const random = () => seq[r++ % seq.length]
			expect(selectColor(0, 7, random)).not.toBe(0)
		})

		it('re-rolls when the random source picks the same color as previous', () => {
			// The first draw maps to index 3 (= previous) so it must be rejected;
			// the second draw maps to 5 and should be returned.
			const seq = [3 / 7, 5 / 7]
			let r = 0
			const random = () => seq[r++]
			expect(selectColor(3, 7, random)).toBe(5)
		})

		it('returns an integer in [0, totalColors)', () => {
			const random = () => 0.9999999
			const result = selectColor(-1, 7, random)
			expect(Number.isInteger(result)).toBe(true)
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThan(7)
		})
	})
}
