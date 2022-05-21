






import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class IntValue extends AbstractPathValue
{
    public value: number
    public constructor(value: number) {
        super()
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitIntValue(this);
    }
}