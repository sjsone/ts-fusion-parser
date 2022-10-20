import { NodePosition } from "./NodePosition";

export abstract class AbstractNode {
    protected position: NodePosition
    protected parent: AbstractNode | undefined

    constructor(position: NodePosition, parent: AbstractNode | undefined = undefined) {
        this.position = position
        this.parent = parent
    }
}