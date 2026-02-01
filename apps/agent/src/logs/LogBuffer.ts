export class LogBuffer {
    private buffer: string[] = [];
    private maxLines: number;

    constructor(maxLines = 500) {
        this.maxLines = maxLines;
    }

    /**
     * LogBuffer push function
     * @param line The line-String which gets pushed into the buffer
     */
    push(line: string) {
        this.buffer.push(line);

        if(this.buffer.length > this.maxLines) {
            this.buffer.shift();
        }
    }

    /**
     * @returns Returns the buffer array
     */
    getLines() {
        return this.buffer
    }

    /**
     * Clears the buffer array
     */
    clear() {
        this.buffer = []
    }
}