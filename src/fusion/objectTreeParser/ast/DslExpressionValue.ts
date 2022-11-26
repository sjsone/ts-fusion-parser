




import { Lexer } from "../../../dsl/afx/lexer";
import { TagNode } from "../../../dsl/afx/nodes/TagNode";
import { TextNode } from "../../../dsl/afx/nodes/TextNode";
import { Parser } from "../../../dsl/afx/parser";
import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";
import { AbstractPathValue } from "./AbstractPathValue";
import { NodePosition, NodePositionStub } from "../../../common/NodePosition";

export class DslExpressionValue extends AbstractPathValue {
    public identifier: string
    public code: string
    public htmlNodes: Array<TextNode | TagNode> = []

    public constructor(identifier: string, code: string, position: NodePosition) {
        super(NodePositionStub)
        this.identifier = identifier
        this.code = code
        this.position = position
    }

    public parse() {
        const lexer = new Lexer(this.code)
        const parser = new Parser(lexer, this.position!.begin + this.identifier.length + 1) // +1 because of [`] in afx`...`
        this.htmlNodes = parser.parse(true)
        for (const htmlNode of this.htmlNodes) {
            htmlNode["parent"] = <any>this
        }
        return parser.nodesByType
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitDslExpressionValue(this, args.shift());
    }
}