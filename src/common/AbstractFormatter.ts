import { AbstractNode } from "./AbstractNode"

export abstract class AbstractFormatter {

    protected indentLevel = 0

    format(nodes: AbstractNode[], baseIndentLevel = 0) {
        const savedIndentLevel = this.indentLevel

        this.indentLevel = baseIndentLevel

        const indentedLines = nodes.map((node: AbstractNode) => this.visitAbstractNode(node)).join("\n")

        this.indentLevel = savedIndentLevel

        return indentedLines
    }

    protected indentLine(line: string) {
        return this.buildIndent(this.indentLevel) + line
    }

    protected buildIndent(indent: number = this.indentLevel, offset: number = 0) {
        return "    ".repeat(indent + offset)
    }

    protected incrementLevel() {
        this.indentLevel += 1
    }

    protected decrementLevel() {
        this.indentLevel -= 1
    }

    abstract visitAbstractNode(node: AbstractNode): any
}