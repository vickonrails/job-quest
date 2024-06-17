import { Readable } from 'stream';

export function bufferToStream(buffer: Buffer) {
    const readableStream = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    });
    return readableStream;
}