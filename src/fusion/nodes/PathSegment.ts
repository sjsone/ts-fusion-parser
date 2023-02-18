import { FusionNodeVisitorInterface } from "../FusionNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";


export class PathSegment extends AbstractPathSegment {
    public identifier: string

    public constructor(identifier: string, position: NodePosition) {
        super(NodePositionStub)
        this.identifier = identifier
        this.position = position
    }

    public visit(visitor: FusionNodeVisitorInterface<any>, ...args: any[]) {
        return visitor.visitPathSegment(this);
    }
}
