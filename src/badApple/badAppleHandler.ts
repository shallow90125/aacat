import type { Context } from 'hono'
import { streamText } from 'hono/streaming'

import { buildFrameOutput } from '../parrot/buildFrameOutput'
import { isCurlUserAgent } from '../parrot/isCurlUserAgent'
import { FRAMES } from './frames'
import { parseColor } from './parseColor'

/**
 * Time each frame is shown for, in milliseconds. 8fps matches the sampling
 * rate used when the frames were extracted from the source video.
 */
const FRAME_INTERVAL_MS = 125

/**
 * Hono handler for the `/bad-apple` endpoint.
 * curl-style clients receive a streaming ASCII playback of the Bad Apple!!
 * silhouette animation; other clients are redirected to this repository.
 * `?color=red` (etc.) overrides the default white foreground.
 */
export function badAppleHandler(c: Context) {
  const userAgent = c.req.header('user-agent') ?? null
  if (!isCurlUserAgent(userAgent)) {
    return c.redirect('https://github.com/shallow90125/aacat', 302)
  }

  const color = parseColor(c.req.query('color'))

  return streamText(c, async (stream) => {
    let index = 0
    while (!stream.aborted && index < FRAMES.length) {
      await stream.write(buildFrameOutput(FRAMES[index], color))
      index++
      await stream.sleep(FRAME_INTERVAL_MS)
    }
  })
}
