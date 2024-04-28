import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class BoolValue extends AbstractPathValue<boolean> {
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitBoolValue(this);
    }
}
