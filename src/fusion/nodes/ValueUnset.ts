import type { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";


export class ValueUnset extends AbstractOperation

{
    public visit(visitor: FusionNodeVisitorInterface)
    {
        return visitor.visitValueUnset(this);
    }
}
