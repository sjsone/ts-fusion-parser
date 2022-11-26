import { AstNodeVisitorInterface } from '../astNodeVisitorInterface';
import { AbstractNode } from '../../../common/AbstractNode'

export abstract class VisitableAbstractNode extends AbstractNode {
    public abstract visit(visitor: AstNodeVisitorInterface, ...args: any[]): any
}