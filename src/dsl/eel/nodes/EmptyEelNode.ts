import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { LiteralNullNode } from "./LiteralNullNode";

export class EmptyEelNode extends LiteralNullNode {
    public constructor(position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super('', position, parent)
    }
}