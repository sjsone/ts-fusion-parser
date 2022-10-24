import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AbstractPathValue } from "./AbstractPathValue";

export class ValueAssignment extends AbstractOperation {
    public pathValue: AbstractPathValue
    
    public constructor(pathValue: AbstractPathValue) {
        super()
        this.pathValue = pathValue
        this.pathValue["parent"] = this
    }

    public visit(visitor: AstNodeVisitorInterface, currentPath: string[]) {
        return visitor.visitValueAssignment(this, currentPath);
    }
}
