import { AbstractFormatter } from "../../common/AbstractFormatter";
import { AbstractNode } from "../../common/AbstractNode";
import { Comment } from "../../common/Comment";
import { EelFormatter } from "../eel/EelFormatter";
import { AfxNodeVisitorInterface } from "./AfxNodeVisitorInterface";
import { InlineEelNode } from "./nodes/InlineEelNode";
import { TagAttributeNode } from "./nodes/TagAttributeNode";
import { TagNameNode } from "./nodes/TagNameNode";
import { TagNode } from "./nodes/TagNode";
import { TagSpreadEelAttributeNode } from "./nodes/TagSpreadEelAttributeNode";
import { TextNode } from "./nodes/TextNode";

export class AfxFormatter extends AbstractFormatter implements AfxNodeVisitorInterface<string> {
    protected eelFormatter = new EelFormatter()

    visitInlineEelNode(inlineEelNode: InlineEelNode): string {
        // TODO: check if it really just joined by " "
        return inlineEelNode["eel"].map(eel => this.eelFormatter.visitAbstractNode(eel)).join(" ")
    }

    visitTagNameNode(tagNameNode: TagNameNode): string {
        return tagNameNode['name'].substring(1)
    }


    visitTagSpreadEelAttributeNode(tagSpreadEelAttributeNode: TagSpreadEelAttributeNode): string {
        return "{" + tagSpreadEelAttributeNode.nodes.map(v => this.eelFormatter.visitAbstractNode(v)).join(" ") + "}"
    }

    visitTagAttributeNode(tagAttributeNode: TagAttributeNode): string {
        const valueString = Array.isArray(tagAttributeNode.value) ? "{" + tagAttributeNode.value.map(v => this.eelFormatter.format([v], this.indentLevel)).join(" ") + "}" : tagAttributeNode.value
        return tagAttributeNode.name + "=" + valueString
    }

    visitTagNode(tagNode: TagNode): string {
        const attributes = tagNode["attributes"].length > 0 ? " " + tagNode["attributes"].map(a => this.visitAbstractNode(a)).join(" ") : ""

        this.incrementLevel()
        const content = tagNode["content"].map(c => this.visitAbstractNode(c)).join("\n").trim()
        const tagBody = content.length > 0 ? "\n" + this.buildIndent() + content + "\n" : ""
        this.decrementLevel()

        const indentedBody = content.length > 0 ? tagBody + this.buildIndent() : tagBody

        return this.indentLine(`<${tagNode["name"]}${attributes}${tagNode["artificiallyClosed"] ? ">" : tagNode["selfClosing"] ? " />" : `>${indentedBody}</${tagNode["name"]}>`}`)
    }

    visitTextNode(textNode: TextNode): string {
        const strIntend = this.buildIndent()
        return this.indentLine(textNode["text"].trim().replace(/\n/g, "\n" + strIntend))
    }

    visitComment(comment: Comment): string {
        return this.indentLine(`<--${comment.value.split("\n").map(l => this.indentLine(l)).join("\n")}-->`)
    }

    visitAbstractNode(abstractNode: AbstractNode): string {
        if (abstractNode instanceof InlineEelNode) return this.visitInlineEelNode(abstractNode)
        if (abstractNode instanceof TagNameNode) return this.visitTagNameNode(abstractNode)
        if (abstractNode instanceof TagSpreadEelAttributeNode) return this.visitTagSpreadEelAttributeNode(abstractNode)

        if (abstractNode instanceof TagAttributeNode) return this.visitTagAttributeNode(abstractNode)
        if (abstractNode instanceof TagNode) return this.visitTagNode(abstractNode)
        if (abstractNode instanceof TextNode) return this.visitTextNode(abstractNode)

        if (abstractNode instanceof Comment) return this.visitComment(abstractNode)

        throw new Error(`Unknown AbstractNode ${abstractNode.constructor.name}`)
    }
}