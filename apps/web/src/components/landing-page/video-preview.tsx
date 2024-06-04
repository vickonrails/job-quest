import DemoVideo from '@/videos/Job.quest-demo-dark.mp4'
import Video from 'next-video'
/**
 * Demo Video
 */
export function VideoPreview() {
    return (
        <div className="border shadow-md rounded-lg w-full">
            <Video
                src={DemoVideo}
                controls={false}
                autoPlay
                muted
                className="w-full"
                loop
            />
        </div>
    )
}