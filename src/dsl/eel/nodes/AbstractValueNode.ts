import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class AbstractValueNode<T> extends AbstractNode {
    protected value: T

    constructor(value: T, position: NodePositionInterface, parent: AbstractNode | null = null) {
        super(position, parent)
        this.value = value
    }
}