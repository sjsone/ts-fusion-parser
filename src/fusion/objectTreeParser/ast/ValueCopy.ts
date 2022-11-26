import { NodePositionStub } from "../../../common/NodePosition";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AssignedObjectPath } from "./AssignedObjectPath";

export class ValueCopy extends AbstractOperation {
    public assignedObjectPath: AssignedObjectPath
    public constructor(assignedObjectPath: AssignedObjectPath) {
        super(NodePositionStub)

        this.assignedObjectPath = assignedObjectPath
        this.assignedObjectPath["parent"] = this
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitValueCopy(this);
    }
}
