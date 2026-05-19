/**
 * ANSI foreground color palette used by the parrot stream.
 * Each value is the SGR escape sequence that switches on the named color.
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
 * SGR sequence that resets all attributes including the foreground color.
 */
export const ANSI_RESET = '\x1b[0m'

/**
 * Escape sequence that clears the visible screen (`\x1b[2J`), wipes the
 * scrollback buffer (`\x1b[3J`) and moves the cursor to the home position
 * (`\x1b[H`). Emitted before each frame so the animation plays in place.
 */
export const CLEAR_SCREEN = '\x1b[2J\x1b[3J\x1b[H'
