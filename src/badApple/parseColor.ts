import { ANSI_COLORS, type ParrotColor } from '../parrot/colors'

const DEFAULT_COLOR: ParrotColor = 'white'

/**
 * Parse a `?color=` query value into a valid ANSI color name.
 * Falls back to `white` for unknown or missing values. The lookup is
 * case-insensitive so `?color=Red` and `?color=red` behave the same.
 *
 * @param raw the raw query parameter value, or `null`/`undefined` when absent
 * @returns a color name that is guaranteed to exist in the ANSI palette
 */
export function parseColor(raw: string | null | undefined): ParrotColor {
	if (raw === null || raw === undefined) {
		return DEFAULT_COLOR
	}
	const normalized = raw.toLowerCase()
	if (normalized in ANSI_COLORS) {
		return normalized as ParrotColor
	}
	return DEFAULT_COLOR
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('parseColor', () => {
		it('returns the default color when the query is missing', () => {
			expect(parseColor(null)).toBe('white')
			expect(parseColor(undefined)).toBe('white')
		})

		it('returns the color name when it is a known palette entry', () => {
			expect(parseColor('red')).toBe('red')
			expect(parseColor('cyan')).toBe('cyan')
		})

		it('matches palette entries case-insensitively', () => {
			expect(parseColor('Green')).toBe('green')
			expect(parseColor('YELLOW')).toBe('yellow')
		})

		it('falls back to the default color for unknown values', () => {
			expect(parseColor('pink')).toBe('white')
			expect(parseColor('')).toBe('white')
		})
	})
}
