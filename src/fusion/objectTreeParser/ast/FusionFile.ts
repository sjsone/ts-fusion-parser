
import { AbstractNode } from "./AbstractNode"
import { StatementList } from "./StatementList"

type AstNodeVisitorInterface = any

export class FusionFile extends AbstractNode {
    public statementList: StatementList
    public contextPathAndFileName: string | undefined
    public nodesByType: Map<any, AbstractNode[]> = new Map()
    public errors: Error[] = []

    public constructor(statementList: StatementList, contextPathAndFileName: string | undefined) {
        super()
        this.statementList = statementList
        this.statementList["parent"] = this

        this.contextPathAndFileName = contextPathAndFileName
    }

    public visit(visitor: AstNodeVisitorInterface) {
        return visitor.visitFusionFile(this)
    }

    public hasErrors() {
        return this.errors.length > 0
    }
}
