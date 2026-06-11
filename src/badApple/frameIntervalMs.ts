/**
 * Convert a frame rate to the per-frame display interval.
 *
 * @param fps frames per second of the source animation (must be positive)
 * @returns the interval in milliseconds, rounded to the nearest integer
 */
export function frameIntervalMs(fps: number): number {
  return Math.round(1000 / fps)
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('frameIntervalMs', () => {
    it('returns 33ms for 30fps', () => {
      expect(frameIntervalMs(30)).toBe(33)
    })

    it('returns 125ms for 8fps', () => {
      expect(frameIntervalMs(8)).toBe(125)
    })

    it('returns 1000ms for 1fps', () => {
      expect(frameIntervalMs(1)).toBe(1000)
    })
  })
}
