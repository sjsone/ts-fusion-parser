import { AbstractFormatter } from "../common/AbstractFormatter";
import { AbstractNode } from "../common/AbstractNode";
import { AfxFormatter } from "../dsl/afx/AfxFormatter";
import { EelFormatter } from "../dsl/eel/EelFormatter";
import { FusionNodeVisitorInterface } from "./FusionNodeVisitorInterface";
import { AbstractStatement } from "./nodes/AbstractStatement";
import { AssignedObjectPath } from "./nodes/AssignedObjectPath";
import { Block } from "./nodes/Block";
import { BoolValue } from "./nodes/BoolValue";
import { CharValue } from "./nodes/CharValue";
import { DslExpressionValue } from "./nodes/DslExpressionValue";
import { EelExpressionValue } from "./nodes/EelExpressionValue";
import { FloatValue } from "./nodes/FloatValue";
import { FusionFile } from "./nodes/FusionFile";
import { FusionObjectValue } from "./nodes/FusionObjectValue";
import { IncludeStatement } from "./nodes/IncludeStatement";
import { IntValue } from "./nodes/IntValue";
import { MetaPathSegment } from "./nodes/MetaPathSegment";
import { NullValue } from "./nodes/NullValue";
import { ObjectPath } from "./nodes/ObjectPath";
import { ObjectStatement } from "./nodes/ObjectStatement";
import { PathSegment } from "./nodes/PathSegment";
import { PrototypePathSegment } from "./nodes/PrototypePathSegment";
import { SimpleValue } from "./nodes/SimpleValue";
import { StatementList } from "./nodes/StatementList";
import { StringValue } from "./nodes/StringValue";
import { ValueAssignment } from "./nodes/ValueAssignment";
import { ValueCopy } from "./nodes/ValueCopy";
import { ValueUnset } from "./nodes/ValueUnset";

export class FusionFormatter extends AbstractFormatter implements FusionNodeVisitorInterface<string> {
    protected eelFormatter = new EelFormatter()
    protected afxFormatter = new AfxFormatter()

    protected getNextStatementOfStatementList(statementList: StatementList, statement: AbstractStatement) {
        const index = statementList.statements.indexOf(statement)
        return statementList.statements[index + 1]
    }

    visitFusionFile(fusionFile: FusionFile) {
        return this.visitStatementList(fusionFile.statementList)
    }

    visitStatementList(statementList: StatementList) {
        const groups: string[][] = []

        for(const statement of statementList.statements) {
            if(statement instanceof ObjectStatement) {
                const line = this.visitObjectStatement(statement)

                const firstSegment = statement.path.segments[0]
                if(firstSegment instanceof MetaPathSegment && firstSegment.identifier === "context") {
                    console.log("here")
                }

                const name = statement.path.segments.map(s => s["identifier"]).join(".")
                console.log(">> name", name)
            }
            console.log(">", statement.constructor.name)
        }


        const lines = statementList.statements.map(statement => this.visitAbstractNode(statement)).sort((a, b) => {
            if (a.startsWith("@context")) return -1
            if (b.startsWith("@context")) return 1

            if (a.startsWith("prototype(")) return -1
            if (b.startsWith("prototype(")) return 1

            if (a.startsWith("renderer")) return 1
            if (b.startsWith("renderer")) return -1


            return 0
        })

        const formattedLines: string[] = []




        return formattedLines.join("\n")
    }

    visitIncludeStatement(includeStatement: IncludeStatement) {
        return "visitIncludeStatement()"
    }

    visitObjectStatement(objectStatement: ObjectStatement, ...args: any[]): string {
        const prototypeNameStatement = objectStatement.path.segments.map(p => this.visitAbstractNode(p)).join(".")

        const operation = (objectStatement.operation ? this.visitAbstractNode(objectStatement.operation) : '')
        const block = (objectStatement.block ? ` ${this.visitBlock(objectStatement.block, null)}` : '')
        return prototypeNameStatement + operation + block
    }

    visitBlock(block: Block, currentPath: any[] | null) {
        const hasBlockStatements = block.statementList.statements.length > 0
        this.incrementLevel()
        const stringBlock = hasBlockStatements ? '\n' + this.visitStatementList(block.statementList) + '\n' : ' '
        this.decrementLevel()
        const endBracketIndent = hasBlockStatements ? this.buildIndent() : ''
        return `{${stringBlock}${endBracketIndent}}`
    }

    visitObjectPath(objectPath: ObjectPath, ...args: any[]) {
        throw Error("visitObjectPath")
        return "visitObjectPath"
    }

    visitMetaPathSegment(metaPathSegment: MetaPathSegment) {
        return `@${metaPathSegment.identifier}`
    }

    visitPrototypePathSegment(prototypePathSegment: PrototypePathSegment) {
        return `prototype(${prototypePathSegment.identifier})`
    }

    visitPathSegment(pathSegment: PathSegment) {
        return pathSegment.identifier
    }

    visitValueAssignment(valueAssignment: ValueAssignment, currentPath: string[]) {
        return ' = ' + this.visitAbstractNode(valueAssignment.pathValue)
    }

    visitFusionObjectValue(fusionObjectValue: FusionObjectValue) {
        return fusionObjectValue.value
    }

    visitDslExpressionValue(dslExpressionValue: DslExpressionValue, ...args: any[]) {
        this.incrementLevel()
        const dsl = this.afxFormatter.format(dslExpressionValue.htmlNodes, this.indentLevel)
        this.decrementLevel()

        return dslExpressionValue.identifier + '`\n' + dsl + '\n' + this.buildIndent() + '`'
    }
    visitEelExpressionValue(eelExpressionValue: EelExpressionValue) {
        return `\${${this.eelFormatter.format([<any>eelExpressionValue.nodes], this.indentLevel)}}`
    }

    visitFloatValue(floatValue: FloatValue) {
        return floatValue.value.toString()
    }

    visitIntValue(intValue: IntValue) {
        return intValue.value.toString()
    }

    visitBoolValue(boolValue: BoolValue) {
        return boolValue.value ? 'true' : 'false'
    }

    visitNullValue(nullValue: NullValue) {
        return 'null'
    }

    visitStringValue(stringValue: StringValue) {
        return `"${stringValue.value}"`
    }

    visitValueCopy(valueCopy: ValueCopy) {
        return ' < ' + valueCopy.assignedObjectPath.objectPath.segments.map(p => this.visitAbstractNode(p)).join(".")
    }

    visitAssignedObjectPath(assignedObjectPath: AssignedObjectPath) {
        throw new Error("visitAssignedObjectPath()")
        return "visitAssignedObjectPath()"
    }

    visitValueUnset(valueUnset: ValueUnset) {
        return " >"
    }

    visitCharValue(charValue: CharValue) {
        return `${charValue.value}`
    }

    visitSimpleValue(simpleValue: SimpleValue) {
        return `${simpleValue}`
    }

    visitAbstractNode(node: AbstractNode): string {
        // console.log("visiting", node.constructor.name)
        if (node instanceof FusionFile) return this.visitFusionFile(node)
        if (node instanceof StatementList) return this.visitStatementList(node)
        if (node instanceof IncludeStatement) return this.visitIncludeStatement(node)
        if (node instanceof ObjectStatement) return this.visitObjectStatement(node)
        if (node instanceof Block) return this.visitBlock(node, [])
        if (node instanceof ObjectPath) return this.visitObjectPath(node)
        if (node instanceof MetaPathSegment) return this.visitMetaPathSegment(node)
        if (node instanceof PrototypePathSegment) return this.visitPrototypePathSegment(node)
        if (node instanceof PathSegment) return this.visitPathSegment(node)
        if (node instanceof ValueAssignment) return this.visitValueAssignment(node, [])
        if (node instanceof FusionObjectValue) return this.visitFusionObjectValue(node)
        if (node instanceof DslExpressionValue) return this.visitDslExpressionValue(node)
        if (node instanceof EelExpressionValue) return this.visitEelExpressionValue(node)
        if (node instanceof FloatValue) return this.visitFloatValue(node)
        if (node instanceof IntValue) return this.visitIntValue(node)
        if (node instanceof BoolValue) return this.visitBoolValue(node)
        if (node instanceof NullValue) return this.visitNullValue(node)
        if (node instanceof StringValue) return this.visitStringValue(node)
        if (node instanceof ValueCopy) return this.visitValueCopy(node)
        if (node instanceof AssignedObjectPath) return this.visitAssignedObjectPath(node)
        if (node instanceof ValueUnset) return this.visitValueUnset(node)
        if (node instanceof CharValue) return this.visitCharValue(node)
        if (node instanceof SimpleValue) return this.visitSimpleValue(node)

        throw new Error(`Unknown AbstractNode ${node.constructor.name}`)
    }
}