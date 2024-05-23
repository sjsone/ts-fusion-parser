import { NodePosition } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class NullValue extends AbstractPathValue<null> {
    constructor(position: NodePosition) {
        super(null, position)
    }

    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitNullValue(this);
    }
}
