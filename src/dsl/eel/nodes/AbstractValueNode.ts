import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { EelNode } from "./EelNode";

export class AbstractValueNode<T> extends EelNode {
    constructor(public value: T, position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.value = value
    }

    public getValue() {
        return this.value
    }

    public toString(intend?: number): string {
        return '' + this.value
    }
}