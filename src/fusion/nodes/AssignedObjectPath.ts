import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface"
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { ObjectPath } from "./ObjectPath"
import { NodePosition } from "../../common/NodePosition";
import { AbstractNode } from "../../common/AbstractNode";


export class AssignedObjectPath extends VisitableAbstractNode {
    public objectPath: ObjectPath

    public isRelative: boolean

    public constructor(position: NodePosition, parent: AbstractNode, objectPath: ObjectPath, isRelative: boolean) {
        super(position, parent)
        this.objectPath = objectPath
        AbstractNode.setParentOfNode(this.objectPath, this)
        this.isRelative = isRelative
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]): unknown {
        return visitor.visitAssignedObjectPath(this);
    }
}
