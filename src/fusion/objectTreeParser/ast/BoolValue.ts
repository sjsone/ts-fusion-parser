import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class BoolValue extends AbstractPathValue
{
    public value: boolean
    public constructor(value: boolean) {
        super()
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitBoolValue(this);
    }
}
