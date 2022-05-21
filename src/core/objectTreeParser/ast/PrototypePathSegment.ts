import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";

export class PrototypePathSegment extends AbstractPathSegment
{
    public  identifier: string
    public constructor(identifier: string) {
        super()
        this.identifier = identifier
    }

    public visit(visitor: AstNodeVisitorInterface)
    {
        return visitor.visitPrototypePathSegment(this);
    }

    protected debugPrintInner(): void {
        console.log(`|-identifier:`, this.identifier)
    }
}
