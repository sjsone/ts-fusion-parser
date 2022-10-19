

import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class FloatValue extends AbstractPathValue
{
    public value: number
    public constructor(value: number) {
        super()
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitFloatValue(this);
    }
}
