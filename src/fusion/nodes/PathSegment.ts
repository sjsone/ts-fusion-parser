import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { AbstractPathSegment } from "./AbstractPathSegment";


export class PathSegment extends AbstractPathSegment {
    public visit(visitor: AstNodeVisitorInterface, ...args: any[]): unknown {
        return visitor.visitPathSegment(this);
    }
}
