import { NodePosition } from "./NodePosition";

export abstract class AbstractNode {
    protected position: NodePosition

    constructor(position: NodePosition) {
        this.position = position
    }
}