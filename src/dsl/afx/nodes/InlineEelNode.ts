import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";

export class InlineEelNode extends AbstractNode {
    protected eel: AbstractNode[]

    constructor(position: NodePositionInterface, eel: AbstractNode[], parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.eel = eel
        for (const eelNode of this.eel) {
            eelNode["parent"] = this
        }
    }
}