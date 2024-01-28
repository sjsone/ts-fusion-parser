import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";

export class PrototypePathSegment extends AbstractPathSegment {
    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitPrototypePathSegment(this);
    }

    protected debugPrintInner(): void {
        console.log(`|-identifier: "${this.identifier}" <${this.position.begin, this.position.end}>`)
    }
}
