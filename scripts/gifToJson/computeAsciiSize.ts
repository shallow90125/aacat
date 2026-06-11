/**
 * 元画像の縦横比を保ったまま、ASCII アート用の文字グリッドの寸法を計算する。
 * 端末の文字セルは縦長 (およそ 2:1) なので、高さは半分に補正する。
 *
 * @param sourceWidth 元画像の幅 (ピクセル)
 * @param sourceHeight 元画像の高さ (ピクセル)
 * @param targetWidth 出力する ASCII アートの幅 (文字数)
 * @returns ASCII アートの幅と高さ (文字数)
 * @throws いずれかの引数が 0 以下の場合
 */
export function computeAsciiSize(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number
): { width: number; height: number } {
  if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0) {
    throw new Error('all arguments must be positive')
  }
  const height = Math.max(1, Math.round((targetWidth * sourceHeight) / sourceWidth / 2))
  return { height, width: targetWidth }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('computeAsciiSize', () => {
    it('4:3 の動画を幅 48 にすると 48x18 になる', () => {
      // 既存の bad-apple フレーム (480x360 -> 48x18) と同じ比率
      expect(computeAsciiSize(480, 360, 48)).toEqual({ height: 18, width: 48 })
    })

    it('4:3 の動画を幅 80 にすると 80x30 になる', () => {
      // bad-apple フレームの既定サイズ (512x384 -> 80x30)
      expect(computeAsciiSize(512, 384, 80)).toEqual({ height: 30, width: 80 })
    })

    it('正方形の画像は高さが幅の半分になる', () => {
      expect(computeAsciiSize(100, 100, 40)).toEqual({ height: 20, width: 40 })
    })

    it('高さは最低でも 1 になる', () => {
      expect(computeAsciiSize(1000, 10, 20)).toEqual({ height: 1, width: 20 })
    })

    it('0 以下の引数では例外を投げる', () => {
      expect(() => computeAsciiSize(0, 100, 48)).toThrow()
      expect(() => computeAsciiSize(100, -1, 48)).toThrow()
      expect(() => computeAsciiSize(100, 100, 0)).toThrow()
    })
  })
}
