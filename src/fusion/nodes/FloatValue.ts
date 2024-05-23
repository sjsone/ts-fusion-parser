import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class FloatValue extends AbstractPathValue<number> {
    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitFloatValue(this);
    }
}
