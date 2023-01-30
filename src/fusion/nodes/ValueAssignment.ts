import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";

export class ValueAssignment extends AbstractOperation {
    public pathValue: AbstractPathValue

    public constructor(pathValue: AbstractPathValue, position: NodePosition) {
        super(NodePositionStub)
        this.pathValue = pathValue
        this.pathValue["parent"] = this
        this.position = position
    }
    

    public visit(visitor: AstNodeVisitorInterface, currentPath: string[]) {
        return visitor.visitValueAssignment(this, currentPath);
    }
}
