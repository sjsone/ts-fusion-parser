import { AbstractNode } from "./AbstractNode";
import { NodePosition } from "./NodePosition";
import { ObjectPathNode } from "./ObjectPathNode";

export class ObjectNode extends AbstractNode {
    public path: ObjectPathNode[]

    public constructor(path: ObjectPathNode[], position: NodePosition) {
        super(position)
        this.path = path
    }
}