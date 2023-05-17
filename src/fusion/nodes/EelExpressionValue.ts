import { AbstractNode } from "../../common/AbstractNode";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";

export class EelExpressionValue extends AbstractPathValue {
    public value = ""
    // TODO: check if `nodes` really has to be an array -> per `eelExpressionValue.nodes = eelNodes` probably not
    public nodes: AbstractNode[] = []

    public constructor() {
        super(NodePositionStub)
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitEelExpressionValue(this);
    }
}
