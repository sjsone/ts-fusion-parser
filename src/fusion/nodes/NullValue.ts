import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class NullValue extends AbstractPathValue {
    
    public visit(visitor: FusionNodeVisitorInterface) {
        return visitor.visitNullValue(this);
    }
}
