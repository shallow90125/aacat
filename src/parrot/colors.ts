/**
 * parrot.live で使用される ANSI 256 色のうちのカラーパレット。
 * 各キーは色名で、値は前景色を設定する ANSI エスケープシーケンスのプレフィックス。
 * 出典: https://github.com/Marak/colors.js
 */
export const ANSI_COLORS = {
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	green: '\x1b[32m',
	magenta: '\x1b[35m',
	red: '\x1b[31m',
	white: '\x1b[37m',
	yellow: '\x1b[33m',
} as const

export type ParrotColor = keyof typeof ANSI_COLORS

export const COLOR_NAMES: readonly ParrotColor[] = [
	'red',
	'yellow',
	'green',
	'blue',
	'magenta',
	'cyan',
	'white',
]

/**
 * ANSI 前景色をリセットするエスケープシーケンス。
 */
export const ANSI_RESET = '\x1b[0m'

/**
 * ターミナル画面をクリアしてカーソルを左上に戻すエスケープシーケンス。
 * `\x1b[2J` で表示中の領域を消去、`\x1b[3J` でスクロールバックバッファも消去、
 * `\x1b[H` でカーソルを home position (1,1) に移動する。
 */
export const CLEAR_SCREEN = '\x1b[2J\x1b[3J\x1b[H'
