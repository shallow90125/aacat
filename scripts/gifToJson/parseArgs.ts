/** gifToJson スクリプトの CLI オプション */
export type GifToJsonArgs = {
  inputPath: string
  outputPath: string | null
  width: number
  ramp: string
}

/** 階調文字列の既定値 (暗→明の 10 階調) */
export const DEFAULT_RAMP = ' .:-=+*#%@'

/**
 * gifToJson スクリプトのコマンドライン引数をパースする。
 *
 * 使い方: `<input.gif> [output.json] [--width N] [--ramp CHARS]`
 * `--width` は出力する ASCII アートの幅 (既定 80)、
 * `--ramp` は暗→明の順に並べた階調文字列 (既定 ` .:-=+*#%@`)。
 * ` #` を渡すと従来の 2 値変換になる。
 * 出力パスを省略すると標準出力に書き出す想定 (`outputPath: null`)。
 *
 * @param argv `process.argv.slice(2)` 相当の引数配列
 * @returns パース済みオプション
 * @throws 入力パスがない場合、またはオプションの値が不正な場合
 */
export function parseArgs(argv: readonly string[]): GifToJsonArgs {
  const positionals: string[] = []
  let width = 80
  let ramp = DEFAULT_RAMP

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--width') {
      const value = Number(argv[i + 1])
      if (!Number.isFinite(value)) {
        throw new Error('--width requires a numeric value')
      }
      width = value
      i++
    } else if (arg === '--ramp') {
      const value = argv[i + 1]
      if (value === undefined || value.length === 0) {
        throw new Error('--ramp requires a non-empty string value')
      }
      ramp = value
      i++
    } else if (arg.startsWith('--')) {
      throw new Error(`unknown option: ${arg}`)
    } else {
      positionals.push(arg)
    }
  }

  const [inputPath, outputPath] = positionals
  if (inputPath === undefined) {
    throw new Error('usage: gifToJson <input.gif> [output.json] [--width N] [--ramp CHARS]')
  }
  return { inputPath, outputPath: outputPath ?? null, ramp, width }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('parseArgs', () => {
    it('入力パスのみ指定すると既定値が使われる', () => {
      expect(parseArgs(['in.gif'])).toEqual({
        inputPath: 'in.gif',
        outputPath: null,
        ramp: ' .:-=+*#%@',
        width: 80,
      })
    })

    it('出力パスとオプションを指定できる', () => {
      expect(parseArgs(['in.gif', 'out.json', '--width', '64', '--ramp', ' #'])).toEqual({
        inputPath: 'in.gif',
        outputPath: 'out.json',
        ramp: ' #',
        width: 64,
      })
    })

    it('入力パスがない場合は例外を投げる', () => {
      expect(() => parseArgs([])).toThrow()
    })

    it('--width が不正な場合は例外を投げる', () => {
      expect(() => parseArgs(['in.gif', '--width', 'abc'])).toThrow()
      expect(() => parseArgs(['in.gif', '--width'])).toThrow()
    })

    it('--ramp が空または値なしの場合は例外を投げる', () => {
      expect(() => parseArgs(['in.gif', '--ramp', ''])).toThrow()
      expect(() => parseArgs(['in.gif', '--ramp'])).toThrow()
    })

    it('未知のオプションは例外を投げる', () => {
      expect(() => parseArgs(['in.gif', '--unknown'])).toThrow()
    })
  })
}
