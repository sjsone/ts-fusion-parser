import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition } from "./NodePosition";

export class EelExpressionValue extends AbstractPathValue
{
    public value: string

    public constructor(value: string, position: NodePosition) {
        super()
        this.value = value 
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitEelExpressionValue(this);
    }
}
