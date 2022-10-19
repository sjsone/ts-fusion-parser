




import { Lexer } from "../../../afx/lexer";
import { TagNode } from "../../../afx/nodes/TagNode";
import { TextNode } from "../../../afx/nodes/TextNode";
import { Parser } from "../../../afx/parser";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition } from "./NodePosition";

export class DslExpressionValue extends AbstractPathValue {
    public identifier: string
    public code: string
    public htmlNodes: Array<TextNode | TagNode>

    public constructor(identifier: string, code: string, position: NodePosition) {
        super()
        this.identifier = identifier
        this.code = code
        this.position = position

        const lexer = new Lexer(this.code)
        const parser = new Parser(lexer)
        this.htmlNodes = parser.parse()
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitDslExpressionValue(this, args.shift());
    }
}