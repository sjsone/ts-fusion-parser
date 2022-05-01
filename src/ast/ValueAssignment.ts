import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";
import { AbstractPathValue } from "./AbstractPathValue";

export class ValueAssignment extends AbstractOperation
{
    public  pathValue:AbstractPathValue
    public constructor(pathValue:AbstractPathValue) {
        super()
        this.pathValue = pathValue
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[])
    {
        return visitor.visitValueAssignment(this, ...args);
    }
}
