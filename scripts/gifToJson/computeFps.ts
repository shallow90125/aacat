/**
 * GIF の各フレームの表示時間 (ミリ秒) の配列から平均 fps を計算する。
 * 0 以下の delay は GIF の慣例に従い 100ms として扱う。
 * 結果は小数第 3 位に丸める。
 *
 * @param delays 各フレームの表示時間 (ミリ秒) の配列
 * @returns 平均 fps
 * @throws delays が空配列の場合
 */
export function computeFps(delays: readonly number[]): number {
  if (delays.length === 0) {
    throw new Error('delays must not be empty')
  }
  const normalized = delays.map((delay) => (delay > 0 ? delay : 100))
  const averageMs = normalized.reduce((sum, delay) => sum + delay, 0) / normalized.length
  return Math.round((1000 / averageMs) * 1000) / 1000
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('computeFps', () => {
    it('125ms 均一の delay から 8fps を計算する', () => {
      expect(computeFps([125, 125, 125])).toBe(8)
    })

    it('delay の平均から fps を計算する', () => {
      // 平均 100ms -> 10fps
      expect(computeFps([50, 150])).toBe(10)
    })

    it('割り切れない fps は小数第 3 位に丸める', () => {
      // 平均 30ms -> 33.333...fps
      expect(computeFps([30])).toBe(33.333)
    })

    it('0 以下の delay は 100ms として扱う', () => {
      expect(computeFps([0, 0])).toBe(10)
    })

    it('空配列の場合は例外を投げる', () => {
      expect(() => computeFps([])).toThrow()
    })
  })
}
