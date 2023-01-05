import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition, NodePositionStub } from "../../../common/NodePosition";

export class PrototypePathSegment extends AbstractPathSegment {
    public identifier: string
    public constructor(identifier: string, position: NodePosition) {
        super(NodePositionStub)
        this.identifier = identifier
        this.position = position
    }

    protected debugPrintInner(): void {
        console.log(`|-identifier: "${this.identifier}" <${this.position}>`)
    }
}
