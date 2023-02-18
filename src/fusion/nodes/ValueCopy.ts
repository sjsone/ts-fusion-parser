import { NodePositionStub } from "../../common/NodePosition";
import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AssignedObjectPath } from "./AssignedObjectPath";

export class ValueCopy extends AbstractOperation {
    public assignedObjectPath: AssignedObjectPath
    public constructor(assignedObjectPath: AssignedObjectPath) {
        super(NodePositionStub)

        this.assignedObjectPath = assignedObjectPath
        this.assignedObjectPath["parent"] = this
    }

    public visit(visitor: FusionNodeVisitorInterface, ...args: any[]) {
        return visitor.visitValueCopy(this);
    }
}
