import { AbstractNode } from "../../common/AbstractNode";
import { NodePosition } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AssignedObjectPath } from "./AssignedObjectPath";

export class ValueCopy extends AbstractOperation {
    public assignedObjectPath: AssignedObjectPath
    public constructor(assignedObjectPath: AssignedObjectPath, position: NodePosition, parent: AbstractNode) {
        super(position, parent)

        this.assignedObjectPath = assignedObjectPath
        AbstractNode.setParentOfNode(this.assignedObjectPath, this)
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]): unknown {
        return visitor.visitValueCopy(this);
    }
}
