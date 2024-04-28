import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class StringValue extends AbstractPathValue<string>{
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitStringValue(this);
    }
}