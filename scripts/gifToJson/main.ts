import { writeFile } from 'node:fs/promises'

import { gifToJson } from './gifToJson'
import { parseArgs } from './parseArgs'

/**
 * gifToJson スクリプトのエントリポイント。
 * GIF を `{ fps, frames }` 形式の JSON に変換し、
 * 出力パスが指定されていればファイルに、なければ標準出力に書き出す。
 *
 * 使い方: `bun scripts/gifToJson/main.ts <input.gif> [output.json] [--width N] [--ramp CHARS]`
 *
 * @param argv `process.argv.slice(2)` 相当の引数配列
 */
export async function main(argv: readonly string[]): Promise<void> {
  const args = parseArgs(argv)
  const result = await gifToJson(args.inputPath, args.width, args.ramp)
  const json = JSON.stringify(result)
  if (args.outputPath === null) {
    process.stdout.write(`${json}\n`)
  } else {
    await writeFile(args.outputPath, `${json}\n`)
  }
}

if (import.meta.main) {
  await main(process.argv.slice(2))
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('main', () => {
    it('GIF を変換して JSON ファイルに書き出す', async () => {
      const { mkdtemp, readFile } = await import('node:fs/promises')
      const { tmpdir } = await import('node:os')
      const { join } = await import('node:path')
      const sharp = (await import('sharp')).default

      const dir = await mkdtemp(join(tmpdir(), 'gif-to-json-'))
      const gifPath = join(dir, 'input.gif')
      const jsonPath = join(dir, 'output.json')

      // GIF の delay はセンチ秒単位なので、丸め誤差の出ない 100ms を使う
      const solid = (value: number) =>
        sharp(Buffer.alloc(4 * 4 * 3, value), { raw: { channels: 3, height: 4, width: 4 } })
          .png()
          .toBuffer()
      await sharp([await solid(255), await solid(0)], { join: { animated: true } })
        .gif({ delay: [100, 100] })
        .toFile(gifPath)

      await main([gifPath, jsonPath, '--width', '4'])

      const parsed: unknown = JSON.parse(await readFile(jsonPath, 'utf8'))
      expect(parsed).toEqual({ fps: 10, frames: ['@@@@\n@@@@\n', '    \n    \n'] })
    })
  })
}
