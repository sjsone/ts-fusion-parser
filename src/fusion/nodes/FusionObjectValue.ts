


import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";

export class FusionObjectValue extends AbstractPathValue {
    public value: string
    public constructor(value: string, position: NodePosition) {
        super(NodePositionStub)
        this.value = value
        this.position = position
    }

    public visit(visitor: FusionNodeVisitorInterface) {
        return visitor.visitFusionObjectValue(this);
    }
}

