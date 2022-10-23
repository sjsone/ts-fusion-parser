




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
    public htmlNodes: Array<TextNode | TagNode> = []

    public constructor(identifier: string, code: string, position: NodePosition) {
        super()
        this.identifier = identifier
        this.code = code
        this.position = position
    }

    public parse() {
        const lexer = new Lexer(this.code)
        const parser = new Parser(lexer, this.position!.start + this.identifier.length + 1) // +1 because of [`] in afx`...`
        this.htmlNodes = parser.parse(true)
        for(const htmlNode of this.htmlNodes) {
            htmlNode["parent"] = <any>this
        }
        return parser.nodesByType
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitDslExpressionValue(this, args.shift());
    }
}