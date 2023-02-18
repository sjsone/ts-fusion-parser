import { Comment } from "../../common/Comment";
import { NodeVisitorInterface } from "../../common/NodeVisitorInterface";
import { InlineEelNode } from "./nodes/InlineEelNode";
import { TagAttributeNode } from "./nodes/TagAttributeNode";
import { TagNameNode } from "./nodes/TagNameNode";
import { TagNode } from "./nodes/TagNode";
import { TagSpreadEelAttributeNode } from "./nodes/TagSpreadEelAttributeNode";
import { TextNode } from "./nodes/TextNode";

export interface AfxNodeVisitorInterface<T> extends NodeVisitorInterface<T> {
    visitInlineEelNode(inlineEelNode: InlineEelNode): T
    visitTagNameNode(tagNameNode: TagNameNode): T
    visitTagSpreadEelAttributeNode(tagSpreadEelAttributeNode: TagSpreadEelAttributeNode): T
    visitTagAttributeNode(tagAttributeNode: TagAttributeNode): T
    visitTagNode(tagNode: TagNode): T
    visitTextNode(textNode: TextNode): T
    visitComment(comment: Comment): T
}