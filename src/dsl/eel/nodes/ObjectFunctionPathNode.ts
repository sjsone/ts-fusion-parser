import { AbstractNode } from "../../../common/AbstractNode"
import { NodePositionInterface } from "../../../common/NodePositionInterface"
import { LiteralObjectNode } from "./LiteralObjectNode"
import { ObjectNode } from "./ObjectNode"
import { ObjectPathNode } from "./ObjectPathNode"

export class ObjectFunctionPathNode extends ObjectPathNode {
    public args: AbstractNode[]

    public constructor(value: string, args: AbstractNode[], position: NodePositionInterface, parent: ObjectNode | LiteralObjectNode | undefined = undefined, offset: AbstractNode | undefined = undefined) {
        super(value, position, parent, offset)
        this.args = args
        for (const arg of this.args) {
            AbstractNode.setParentOfNode(arg, this)
        }
    }

    public toString(intend?: number | undefined): string {
        return `${this.value}(${this.args.map(arg => arg.toString()).join(", ")})` + (this.offset?.toString() ?? '')
    }
}