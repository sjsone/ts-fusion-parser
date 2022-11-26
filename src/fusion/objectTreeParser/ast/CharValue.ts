
import { NodePositionStub } from "../../../common/NodePosition";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class CharValue extends AbstractPathValue {
    public value: string
    public constructor(value: string) {
        super(NodePositionStub)
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitCharValue(this);
    }
}

