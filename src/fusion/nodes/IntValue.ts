






import { NodePositionStub } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class IntValue extends AbstractPathValue {
    public value: number
    public constructor(value: number) {
        super(NodePositionStub)
        this.value = value
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitIntValue(this);
    }
}