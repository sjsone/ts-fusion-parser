import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionInterface } from "../../../common/NodePositionInterface";
import { EelNode } from "./EelNode";
import { ObjectPathNode } from "./ObjectPathNode";

export class ObjectNode extends EelNode {
    public path: ObjectPathNode[]

    public constructor(path: ObjectPathNode[], position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        super(position, parent)
        this.path = path
        for (const part of this.path) {
            part["parent"] = this
        }
    }

    public toString(intend?: number): string {
        return this.path.map(part => part.toString()).join(".")
    }
}