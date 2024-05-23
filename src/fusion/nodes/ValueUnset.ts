import type { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractOperation } from "./AbstractOperation";


export class ValueUnset extends AbstractOperation {
    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitValueUnset(this);
    }
}
