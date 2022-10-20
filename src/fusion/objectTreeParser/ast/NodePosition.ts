export class NodePosition {
    public start: number
    public end: number 
    
    constructor(start: number, end: number = Infinity) {
        this.start = start
        this.end = end
    }

    toString() {
        return `${this.start}-${this.end}`
    }
}