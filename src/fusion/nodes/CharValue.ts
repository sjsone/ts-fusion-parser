
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class CharValue extends AbstractPathValue<string> {
    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitCharValue(this);
    }
}

