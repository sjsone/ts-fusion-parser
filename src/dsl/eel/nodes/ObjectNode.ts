import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";
import { ObjectPathNode } from "./ObjectPathNode";

export class ObjectNode extends AbstractNode {
    public path: ObjectPathNode[]

    public constructor(path: ObjectPathNode[], position: NodePosition, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.path = path
        for(const part of this.path) {
            part["parent"] = this
        }
    }
}