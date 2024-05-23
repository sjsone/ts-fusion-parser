




import { AbstractNode } from "../../common/AbstractNode";
import { Comment } from "../../common/Comment";
import { NodePosition } from "../../common/NodePosition";
import { AstNodeVisitorInterface } from "../../common/nodeVisitorInterface";
import { Lexer } from "../../dsl/afx/lexer";
import { InlineEelNode } from "../../dsl/afx/nodes/InlineEelNode";
import { TagNode } from "../../dsl/afx/nodes/TagNode";
import { TextNode } from "../../dsl/afx/nodes/TextNode";
import { AfxParserOptions, Parser } from "../../dsl/afx/parser";
import { AbstractPathValue } from "./AbstractPathValue";

export class DslExpressionValue extends AbstractPathValue<string> {
    public identifier: string
    public htmlNodes: Array<TextNode | InlineEelNode | TagNode | Comment> = []
    protected afxParserOptions?: AfxParserOptions

    public constructor(identifier: string, code: string, position: NodePosition, afxParserOptions?: AfxParserOptions) {
        super(code, position)
        this.identifier = identifier
        this.afxParserOptions = afxParserOptions
    }

    public parse(): Map<typeof AbstractNode, AbstractNode[]> {
        const lexer = new Lexer(this.value)
        const parser = new Parser(lexer, this.position.begin + this.identifier.length + 1, this.afxParserOptions) // +1 because of [`] in afx`...`
        this.htmlNodes = parser.parse()
        for (const htmlNode of this.htmlNodes) {
            AbstractNode.setParentOfNode(htmlNode, this)
        }
        return parser.nodesByType
    }

    public visit(visitor: AstNodeVisitorInterface, ...args: any[]): unknown {
        return visitor.visitDslExpressionValue(this, args.shift());
    }
}