import { AbstractNode } from "../../common/AbstractNode";
import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";

export class EelExpressionValue extends AbstractPathValue {
    public value = ""
    public nodes: AbstractNode[] = []

    public constructor() {
        super(NodePositionStub)
    }

    public visit(visitor: FusionNodeVisitorInterface) {
        return visitor.visitEelExpressionValue(this);
    }
}
