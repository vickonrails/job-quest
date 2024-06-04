import { env } from '@/env.mjs'
import Video from 'next-video'
/**
 * Demo Video
 */
export function VideoPreview() {
    return (
        <div className="border shadow-md rounded-lg w-full">
            <Video
                playbackId={env.NEXT_PUBLIC_MUX_PLAYBACK_ID}
                controls={false}
                autoPlay
                muted
                className="w-full"
                loop
            />
        </div>
    )
}