import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class FloatValue extends AbstractPathValue<number> {
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitFloatValue(this);
    }
}
