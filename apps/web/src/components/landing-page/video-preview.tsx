
/**
 * Demo Video
 */
export function VideoPreview() {
    return (
        <div className="border shadow-md rounded-lg">
            <video autoPlay muted loop>
                <source src="/Job.quest-demo-dark.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}