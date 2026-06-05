import type { Context } from 'hono'
import { streamText } from 'hono/streaming'

import { buildFrameOutput } from './buildFrameOutput'
import { COLOR_NAMES } from './colors'
import { flipFrame } from './flipFrame'
import { FRAMES } from './frames'
import { isCurlUserAgent } from './isCurlUserAgent'
import { selectColor } from './selectColor'

/**
 * Time each frame is shown for, in milliseconds. Matches parrot.live.
 */
const FRAME_INTERVAL_MS = 70

/**
 * Hono handler for the `/parrot` endpoint.
 * curl-style clients receive a streaming ASCII parrot animation; other clients
 * are redirected to this repository. When `?flip=true` is supplied the frames
 * are mirrored.
 */
export function parrotHandler(c: Context) {
	const userAgent = c.req.header('user-agent') ?? null
	if (!isCurlUserAgent(userAgent)) {
		return c.redirect('https://github.com/shallow90125/aacat', 302)
	}

	const flip = c.req.query('flip') === 'true'
	const frames = flip ? FRAMES.map(flipFrame) : FRAMES

	return streamText(c, async (stream) => {
		let index = 0
		let lastColor = -1
		while (!stream.aborted) {
			lastColor = selectColor(lastColor, COLOR_NAMES.length, Math.random)
			await stream.write(buildFrameOutput(frames[index], COLOR_NAMES[lastColor]))
			index = (index + 1) % frames.length
			await stream.sleep(FRAME_INTERVAL_MS)
		}
	})
}
