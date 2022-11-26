import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";
import { NodePosition } from "../../../common/NodePosition";

export class PrototypePathSegment extends AbstractPathSegment
{
    public  identifier: string
    public constructor(identifier: string, position: NodePosition) {
        super()
        this.identifier = identifier
        this.position = position
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitPrototypePathSegment(this);
    }

    protected debugPrintInner(): void {
        console.log(`|-identifier: "${this.identifier}" <${this.position}>`)
    }
}
