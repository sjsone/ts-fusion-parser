import { AbstractNode } from "../common/AbstractNode"

export interface ParserHandoverResult<T extends AbstractNode> {
    [key: string]: any
    nodeOrNodes: Array<T>
    cursor: number
}

export interface ParserInterface {
    handover<T extends AbstractNode>(parser: ParserInterface): T | Array<T>
    receiveHandover<T extends AbstractNode>(text: string, offset: number): ParserHandoverResult<T>
}