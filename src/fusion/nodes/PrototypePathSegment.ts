import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";

export class PrototypePathSegment extends AbstractPathSegment {
    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitPrototypePathSegment(this);
    }

    protected debugPrintInner(): void {
        console.log(`|-identifier: "${this.identifier}" <${this.position.begin, this.position.end}>`)
    }
}
