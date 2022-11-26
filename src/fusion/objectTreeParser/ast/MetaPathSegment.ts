





import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition, NodePositionStub } from "../../../common/NodePosition";

export class MetaPathSegment extends AbstractPathSegment {
    public identifier: string
    public constructor(identifier: string, position: NodePosition) {
        super(NodePositionStub)
        this.identifier = identifier
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitMetaPathSegment(this);
    }
}