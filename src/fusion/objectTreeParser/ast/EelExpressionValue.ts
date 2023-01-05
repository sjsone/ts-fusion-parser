import { AbstractNode } from "../../../common/AbstractNode";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition, NodePositionStub } from "../../../common/NodePosition";

export class EelExpressionValue extends AbstractPathValue {
    public value: string = ""
    public nodes: AbstractNode[] = []

    public constructor() {
        super(NodePositionStub)
    }

}
