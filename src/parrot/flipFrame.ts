/**
 * Reverse the entire frame string, character by character.
 * Used when `?flip=true` is supplied to serve a mirrored parrot.
 * Matches parrot.live's behavior of reversing the whole string instead of each line.
 *
 * @param frame the frame string to reverse
 * @returns the character-reversed frame string
 */
export function flipFrame(frame: string): string {
  return frame.split('').reverse().join('')
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('flipFrame', () => {
    it('reverses the string character by character', () => {
      expect(flipFrame('abc')).toBe('cba')
    })

    it('returns an empty string for an empty input', () => {
      expect(flipFrame('')).toBe('')
    })

    it('reverses across newlines as well', () => {
      expect(flipFrame('ab\ncd')).toBe('dc\nba')
    })
  })
}
