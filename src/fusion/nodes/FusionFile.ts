
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { StatementList } from "./StatementList"
import { AbstractNode } from "../../common/AbstractNode";
import { NodePositionStub } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";

export class FusionFile extends VisitableAbstractNode {
    public statementList: StatementList
    public contextPathAndFileName: string | undefined
    public nodesByType: Map<any, AbstractNode[]> = new Map()
    public errors: Error[] = []

    public constructor(statementList: StatementList, contextPathAndFileName: string | undefined) {
        super(NodePositionStub)
        this.statementList = statementList
        this.statementList["parent"] = this

        this.contextPathAndFileName = contextPathAndFileName
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitFusionFile(this)
    }

    getNodesByType<T extends abstract new (...args: any) => any>(type: T) {
        const nodes = this.nodesByType.get(type);
        return nodes !== undefined ? nodes as InstanceType<T>[] : undefined;
    }

    public hasErrors() {
        return this.errors.length > 0
    }

    public toString(intend: number = 0): string {
        return this.statementList.toString(intend)
    }
}
