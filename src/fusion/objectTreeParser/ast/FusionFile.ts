
import { VisitableAbstractNode } from "./VisitableAbstractNode";
import { StatementList } from "./StatementList"
import { AbstractNode } from "../../../common/AbstractNode";
import { NodePositionStub } from "../../../common/NodePosition";

type AstNodeVisitorInterface = any

export class FusionFile extends VisitableAbstractNode {
    public statementList: StatementList
    public contextPathAndFileName: string | null = null
    public nodesByType: Map<any, AbstractNode[]> = new Map()
    public errors: Error[] = []

    public constructor(statementList: StatementList, contextPathAndFileName: string | null) {
        super(NodePositionStub)
        this.statementList = statementList
        this.statementList["parent"] = this

        this.contextPathAndFileName = contextPathAndFileName
    }

    public hasErrors(): boolean {
        return this.errors.length > 0
    }
}
