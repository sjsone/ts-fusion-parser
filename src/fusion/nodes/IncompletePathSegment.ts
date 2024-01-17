import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";

export class IncompletePathSegment extends AbstractPathSegment {
    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitPathSegment(this);
    }
}
