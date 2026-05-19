import { CLEAR_SCREEN, type ParrotColor } from './colors'
import { colorize } from './colorize'

/**
 * Build the output for a single frame: the screen-clear sequence followed by
 * the colorized frame.
 *
 * @param frame the frame body, including its trailing newline
 * @param color the color name used to colorize the frame
 * @returns the ready-to-stream string for this frame
 */
export function buildFrameOutput(frame: string, color: ParrotColor): string {
	return `${CLEAR_SCREEN}${colorize(frame, color)}`
}

if (import.meta.vitest) {
	const { describe, it, expect } = import.meta.vitest

	describe('buildFrameOutput', () => {
		it('returns the clear sequence followed by the colorized frame', () => {
			const output = buildFrameOutput('AAA', 'red')
			expect(output).toBe('\x1b[2J\x1b[3J\x1b[H\x1b[31mAAA\x1b[0m')
		})

		it('starts with the clear sequence', () => {
			expect(buildFrameOutput('X', 'blue').startsWith('\x1b[2J\x1b[3J\x1b[H')).toBe(true)
		})
	})
}
