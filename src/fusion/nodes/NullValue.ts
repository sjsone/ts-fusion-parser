import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class NullValue extends AbstractPathValue {
    
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitNullValue(this);
    }
}
