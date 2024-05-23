import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class StringValue extends AbstractPathValue<string> {
    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitStringValue(this);
    }
}