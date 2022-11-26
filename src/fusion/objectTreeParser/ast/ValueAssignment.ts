import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition } from "../../../common/NodePosition";

export class ValueAssignment extends AbstractOperation {
    public pathValue: AbstractPathValue
    
    public constructor(pathValue: AbstractPathValue, position: NodePosition) {
        super()
        this.pathValue = pathValue
        this.pathValue["parent"] = this
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface, currentPath: string[]) {
        return visitor.visitValueAssignment(this, currentPath);
    }
}
