import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class SimpleValue extends AbstractPathValue<any> {
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitSimpleValue(this);
    }
}