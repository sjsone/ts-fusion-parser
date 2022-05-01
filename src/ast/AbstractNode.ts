import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";

export abstract class AbstractNode {
    public abstract visit(visitor: AstNodeVisitorInterface, ...args: any[]): any
}
