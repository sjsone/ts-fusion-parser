
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { StatementList } from "./StatementList"
import { AbstractNode } from "../../common/AbstractNode";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";

export class FusionFile extends VisitableAbstractNode {
    public statementList: StatementList
    public contextPathAndFileName: string | undefined
    public nodesByType: Map<any, AbstractNode[]> = new Map()
    public errors: Error[] = []

    public constructor(statementList: StatementList, contextPathAndFileName: string | undefined) {
        super({
            begin: -1,
            end: -1
        })
        this.statementList = statementList
        AbstractNode.setParentOfNode(this.statementList, this)

        this.contextPathAndFileName = contextPathAndFileName
    }

    public visit(visitor: AstNodeVisitorInterface): unknown {
        return visitor.visitFusionFile(this)
    }

    getNodesByType<T extends abstract new (...args: any) => any>(type: T): InstanceType<T>[] | undefined {
        const nodes = this.nodesByType.get(type);
        return nodes !== undefined ? nodes as InstanceType<T>[] : undefined;
    }

    public hasErrors(): boolean {
        return this.errors.length > 0
    }

    public toString(intend: number = 0): string {
        return this.statementList.toString(intend)
    }
}
