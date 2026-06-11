import type { Context } from 'hono'
import { streamText } from 'hono/streaming'

import { buildFrameOutput } from '../parrot/buildFrameOutput'
import { isCurlUserAgent } from '../parrot/isCurlUserAgent'
import { frameIntervalMs } from './frameIntervalMs'
import framesJson from './frames.json'
import { parseColor } from './parseColor'

/**
 * Frames of the Bad Apple!! animation, rendered as 80x30 ASCII.
 * Generated from the source video by `scripts/gifToJson`.
 * Source video: https://archive.org/details/TouhouBadApple
 */
const FRAMES: readonly string[] = framesJson.frames

/**
 * Time each frame is shown for, in milliseconds. Derived from the frame rate
 * the frames were sampled at when extracted from the source video.
 */
const FRAME_INTERVAL_MS = frameIntervalMs(framesJson.fps)

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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('frames.json', () => {
    it('contains at least one frame', () => {
      expect(FRAMES.length).toBeGreaterThan(0)
    })

    it('every frame ends with a newline', () => {
      expect(FRAMES.every((frame) => frame.endsWith('\n'))).toBe(true)
    })

    it('every frame has 30 lines of width 80', () => {
      const wellFormed = FRAMES.every((frame) => {
        const lines = frame.split('\n').slice(0, -1)
        return lines.length === 30 && lines.every((line) => line.length === 80)
      })
      expect(wellFormed).toBe(true)
    })

    it('fps is a positive number', () => {
      expect(framesJson.fps).toBeGreaterThan(0)
    })
  })
}
