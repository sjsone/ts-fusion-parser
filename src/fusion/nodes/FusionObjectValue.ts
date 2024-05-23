import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class FusionObjectValue extends AbstractPathValue<string> {
    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitFusionObjectValue(this);
    }
}

