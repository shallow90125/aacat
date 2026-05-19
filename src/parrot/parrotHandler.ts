import { COLOR_NAMES } from './colors'
import type { Context } from 'hono'
import { FRAMES } from './frames'
import { buildFrameOutput } from './buildFrameOutput'
import { flipFrame } from './flipFrame'
import { isCurlUserAgent } from './isCurlUserAgent'
import { selectColor } from './selectColor'
import { streamText } from 'hono/streaming'

/**
 * 1 フレームあたりの表示時間 (ミリ秒)。parrot.live 本家と同じ 70ms。
 */
const FRAME_INTERVAL_MS = 70

/**
 * /parrot エンドポイントの Hono ハンドラ。
 * curl 系クライアントには ASCII パロットアニメーションをストリーミングし、
 * それ以外には parrot.live と同様にオリジナルリポジトリへリダイレクトする。
 * `?flip=true` 指定時は文字列を反転したフレームを使う。
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
