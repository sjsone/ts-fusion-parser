import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { ObjectPathNode } from "./ObjectPathNode";

export class ObjectNode extends AbstractNode {
    public path: ObjectPathNode[]

    public constructor(path: ObjectPathNode[], position: NodePositionInterface, parent: AbstractNode | null = null) {
        super(position, parent)
        this.path = path
        for(const part of this.path) {
            part["parent"] = this
        }
    }
}