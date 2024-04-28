import { NodePositionInterface } from "./NodePositionInterface"

export class NodePosition implements NodePositionInterface {
    public begin: number
    public end: number

    constructor(begin: number, end: number = Infinity) {
        this.begin = begin
        this.end = end
    }

    toString() {
        return `${this.begin}-${this.end}`
    }
}