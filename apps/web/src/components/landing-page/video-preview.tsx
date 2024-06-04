import Image from 'next/image'
/**
 * Demo Video
 */
export function VideoPreview() {
    return (
        <div className="shadow-md rounded-lg h-full">
            <Image src="/screenshot-header.png" alt="" className="w-full" width={'1000'} height={'600'} />
        </div>
    )
}