import { NodePositionInterface } from "./NodePositionInterface";

export abstract class AbstractNode {
    protected position: NodePositionInterface
    protected parent: AbstractNode | undefined

    constructor(position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        this.position = position
        this.parent = parent
    }
}