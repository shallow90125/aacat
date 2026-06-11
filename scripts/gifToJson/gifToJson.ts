import sharp from 'sharp'

import { computeAsciiSize } from './computeAsciiSize'
import { computeFps } from './computeFps'
import { frameToAscii } from './frameToAscii'

/**
 * アニメーション GIF を `{ fps, frames }` 形式のオブジェクトに変換する。
 * 各フレームは `src/badApple/frames.json` と同じ形式の ASCII アート文字列になる。
 *
 * @param input GIF ファイルのパスまたはバッファ
 * @param targetWidth 出力する ASCII アートの幅 (文字数)
 * @param ramp 暗→明の順に並べた階調文字列 (1 文字以上)
 * @returns fps と ASCII アートフレームの配列
 */
export async function gifToJson(
  input: string | Buffer,
  targetWidth: number,
  ramp: string
): Promise<{ fps: number; frames: string[] }> {
  // アニメーション GIF は全フレームを縦に連結した 1 枚として扱われ、
  // フレーム数が多いと既定のピクセル上限 (約 2.7 億) を超えるため無効化する
  const options = { animated: true, limitInputPixels: false }
  const metadata = await sharp(input, options).metadata()
  const pageHeight = metadata.pageHeight ?? metadata.height
  const { width, height } = computeAsciiSize(metadata.width, pageHeight, targetWidth)

  // resize はページ単位で適用されるため、1 回のデコードで全フレームを変換できる
  const { data, info } = await sharp(input, options)
    .resize(width, height, { fit: 'fill' })
    .flatten({ background: '#000000' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  if (info.channels !== 1) {
    throw new Error(`expected 1 channel after grayscale, got ${info.channels}`)
  }

  const pageSize = width * height
  const pages = info.pages ?? 1
  const frames: string[] = []
  for (let page = 0; page < pages; page++) {
    const pixels = new Uint8Array(data.buffer, data.byteOffset + page * pageSize, pageSize)
    frames.push(frameToAscii(pixels, width, height, ramp))
  }

  const delays = metadata.delay ?? []
  const fps = computeFps(delays.length > 0 ? delays : [100])
  return { fps, frames }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  /** 全ピクセルが同じ輝度の 4x4 グレースケールフレームを作る */
  const solidFrame = (value: number) =>
    sharp(Buffer.alloc(4 * 4 * 3, value), { raw: { channels: 3, height: 4, width: 4 } })

  /** 白フレームと黒フレームの 2 フレーム GIF (delay 100ms) を作る */
  const createTestGif = async (): Promise<Buffer> => {
    const white = await solidFrame(255).png().toBuffer()
    const black = await solidFrame(0).png().toBuffer()
    return sharp([white, black], { join: { animated: true } })
      .gif({ delay: [100, 100] })
      .toBuffer()
  }

  describe('gifToJson', () => {
    it('GIF を fps とフレームの配列に変換する', async () => {
      const gif = await createTestGif()
      const result = await gifToJson(gif, 4, ' .:-=+*#%@')
      expect(result.fps).toBe(10)
      expect(result.frames).toEqual(['@@@@\n@@@@\n', '    \n    \n'])
    })

    it('targetWidth に合わせて縦横比を保った寸法になる', async () => {
      const gif = await createTestGif()
      const result = await gifToJson(gif, 8, ' #')
      // 4x4 -> 幅 8、高さは文字セル補正で 4
      expect(result.frames[0]).toBe('########\n########\n########\n########\n')
    })
  })
}
