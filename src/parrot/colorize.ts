import { ANSI_COLORS, ANSI_RESET, type ParrotColor } from './colors'

/**
 * Wrap text in the ANSI escape sequence for the given color and always close
 * with a reset, so the color does not bleed into subsequent output.
 *
 * @param text the text to colorize
 * @param color a color name present in the palette
 * @returns the text surrounded by SGR escape sequences
 */
export function colorize(text: string, color: ParrotColor): string {
  return `${ANSI_COLORS[color]}${text}${ANSI_RESET}`
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('colorize', () => {
    it('wraps the text with the color escape and ends with a reset', () => {
      expect(colorize('hi', 'red')).toBe('\x1b[31mhi\x1b[0m')
    })

    it('still emits the surrounding escapes for an empty string', () => {
      expect(colorize('', 'blue')).toBe('\x1b[34m\x1b[0m')
    })
  })
}
