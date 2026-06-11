/**
 * グレースケール 1 チャンネルのピクセルバッファを ASCII アート文字列に変換する。
 * 輝度 (0-255) を ramp の文字に等分マッピングする。ramp は暗い方から明るい方へ
 * 並べた文字列で、例えば ` .:-=+*#%@` なら 10 階調になる。` #` の 2 文字を
 * 渡すと従来のしきい値 128 の 2 値変換と同じ結果になる。
 * 各行は改行で終わる (末尾行も含む)。既存の `src/badApple/frames.json` と同じ形式。
 *
 * @param pixels グレースケールのピクセル値 (width * height 要素)
 * @param width 画像の幅 (ピクセル)
 * @param height 画像の高さ (ピクセル)
 * @param ramp 暗→明の順に並べた階調文字列 (1 文字以上)
 * @returns ASCII アート文字列
 * @throws pixels の長さが width * height と一致しない場合、または ramp が空の場合
 */
export function frameToAscii(
  pixels: Uint8Array,
  width: number,
  height: number,
  ramp: string
): string {
  if (ramp.length === 0) {
    throw new Error('ramp must contain at least one character')
  }
  if (pixels.length !== width * height) {
    throw new Error(`pixels length ${pixels.length} does not match ${width}x${height}`)
  }
  let ascii = ''
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 0-255 を 0-(ramp.length-1) に等分割する (255 でも範囲内に収まる)
      ascii += ramp[Math.floor((pixels[y * width + x] * ramp.length) / 256)]
    }
    ascii += '\n'
  }
  return ascii
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('frameToAscii', () => {
    it('輝度を ramp の文字に等分マッピングする', () => {
      const ramp = ' .:-=+*#%@'
      const pixels = new Uint8Array([0, 26, 128, 255])
      // 0 -> ' ', 26 -> floor(26*10/256)=1 -> '.', 128 -> 5 -> '+', 255 -> 9 -> '@'
      expect(frameToAscii(pixels, 2, 2, ramp)).toBe(' .\n+@\n')
    })

    it('2 文字の ramp はしきい値 128 の 2 値変換と一致する', () => {
      const pixels = new Uint8Array([255, 0, 127, 128])
      expect(frameToAscii(pixels, 2, 2, ' #')).toBe('# \n #\n')
    })

    it('各行が改行で終わる (末尾行も含む)', () => {
      const pixels = new Uint8Array([255, 255, 255])
      expect(frameToAscii(pixels, 3, 1, ' #')).toBe('###\n')
    })

    it('全ピクセルが暗い場合は最初の階調のみになる', () => {
      const pixels = new Uint8Array([0, 0, 0, 0])
      expect(frameToAscii(pixels, 2, 2, ' .#')).toBe('  \n  \n')
    })

    it('pixels の長さが width * height と一致しない場合は例外を投げる', () => {
      expect(() => frameToAscii(new Uint8Array([0, 0, 0]), 2, 2, ' #')).toThrow()
    })

    it('ramp が空文字列の場合は例外を投げる', () => {
      expect(() => frameToAscii(new Uint8Array([0]), 1, 1, '')).toThrow()
    })
  })
}
