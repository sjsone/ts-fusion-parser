import { AbstractEELNode } from "../../eel/ast/AbstractEELNode";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class EelExpressionValue extends AbstractPathValue
{
    public value: string
    public eel: AbstractEELNode
    public constructor(value: string, eel: AbstractEELNode) {
        super()
        this.eel = eel
        this.value = value 
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitEelExpressionValue(this);
    }
}
