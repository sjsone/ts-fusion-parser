import { FusionNodeVisitorInterface } from '../FusionNodeVisitorInterface';
import { AbstractNode } from '../../common/AbstractNode'

export abstract class VisitableAbstractNode extends AbstractNode {
    public abstract visit(visitor: FusionNodeVisitorInterface, ...args: any[]): any
}