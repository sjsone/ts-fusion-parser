import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class IntValue extends AbstractPathValue<number> {
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitIntValue(this);
    }
}