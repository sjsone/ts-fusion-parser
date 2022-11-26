import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";

export class AbstractValueNode<T> extends AbstractNode {
    protected value: T

    constructor(value: T, position: NodePosition, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.value = value
    }
}