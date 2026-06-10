/**
 * Decide whether a User-Agent string belongs to a curl-style client.
 * The check is case-insensitive and only looks for the substring `curl`.
 * parrot.live uses the same heuristic to redirect browsers to its GitHub page.
 *
 * @param userAgent the request's User-Agent header, or `null` if absent
 * @returns true when the request looks like it came from a curl-compatible client
 */
export function isCurlUserAgent(userAgent: string | null): boolean {
  if (userAgent === null) {
    // Treat a missing User-Agent as a simple terminal client (curl, wget, etc.)
    // and stream the animation, matching parrot.live's behavior.
    return true
  }
  return userAgent.toLowerCase().includes('curl')
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('isCurlUserAgent', () => {
    it('returns true for a curl User-Agent', () => {
      expect(isCurlUserAgent('curl/8.4.0')).toBe(true)
    })

    it('returns true for uppercase CURL as well', () => {
      expect(isCurlUserAgent('CURL/8.4.0')).toBe(true)
    })

    it('returns false for a browser User-Agent', () => {
      expect(
        isCurlUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
      ).toBe(false)
    })

    it('returns true when the User-Agent is missing (null)', () => {
      expect(isCurlUserAgent(null)).toBe(true)
    })
  })
}
