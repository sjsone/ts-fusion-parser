import { AbstractNode } from "../../common/AbstractNode";
import { NodePosition } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";

export class EelExpressionValue extends AbstractPathValue<string> {
    // TODO: check if `nodes` really has to be an array -> per `eelExpressionValue.nodes = eelNodes` probably not

    public constructor(value: string, position: NodePosition, public nodes: AbstractNode[] = []) {
        super(value, position);

        if (Array.isArray(nodes)) {
            for (const node of nodes) AbstractNode.setParentOfNode(node, this)
        } else {
            AbstractNode.setParentOfNode(nodes, this)
        }
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitEelExpressionValue(this);
    }
}
