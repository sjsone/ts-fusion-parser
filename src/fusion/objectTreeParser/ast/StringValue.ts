

import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition, NodePositionStub } from "../../../common/NodePosition";

export class StringValue extends AbstractPathValue {
    public value: string
    public constructor(value: string, position: NodePosition) {
        super(NodePositionStub)
        this.value = value
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitStringValue(this);
    }
}