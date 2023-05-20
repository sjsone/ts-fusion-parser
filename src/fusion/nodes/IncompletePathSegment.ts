import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";


export class IncompletePathSegment extends AbstractPathSegment {
    public identifier: string = ""

    public constructor(position: NodePosition) {
        super(NodePositionStub)
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitPathSegment(this);
    }
}
