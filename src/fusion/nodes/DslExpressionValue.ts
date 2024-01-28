




import { Comment } from "../../common/Comment";
import { NodePosition, NodePositionStub } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { Lexer } from "../../dsl/afx/lexer";
import { InlineEelNode } from "../../dsl/afx/nodes/InlineEelNode";
import { TagNode } from "../../dsl/afx/nodes/TagNode";
import { TextNode } from "../../dsl/afx/nodes/TextNode";
import { AfxParserOptions, Parser } from "../../dsl/afx/parser";
import { AbstractPathValue } from "./AbstractPathValue";

export class DslExpressionValue extends AbstractPathValue {
    public identifier: string
    public code: string
    public htmlNodes: Array<TextNode | InlineEelNode | TagNode | Comment> = []
    protected afxParserOptions?: AfxParserOptions

    public constructor(identifier: string, code: string, position: NodePosition, afxParserOptions?: AfxParserOptions) {
        super(NodePositionStub)
        this.identifier = identifier
        this.code = code
        this.position = position
        this.afxParserOptions = afxParserOptions
    }

    public parse() {
        const lexer = new Lexer(this.code)
        const parser = new Parser(lexer, this.position.begin + this.identifier.length + 1, this.afxParserOptions) // +1 because of [`] in afx`...`
        this.htmlNodes = parser.parse()
        for (const htmlNode of this.htmlNodes) {
            htmlNode["parent"] = <any>this
        }
        return parser.nodesByType
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]) {
        return visitor.visitDslExpressionValue(this, args.shift());
    }
}