import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";


export class PathSegment extends AbstractPathSegment {
    public identifier: string

    public constructor(identifier: string, position: NodePosition) {
        super(NodePositionStub)
        this.identifier = identifier
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitPathSegment(this);
    }
}
