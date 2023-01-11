import { EOLError } from "./errors/eolError";
import { Token, TokenConstructor } from "./Token";


export abstract class AbstractLexer {
    protected text: string
    protected cursor: number = -1
    protected lookAheadTokenType: TokenConstructor|undefined
    public tagStack: Token[] = []

    constructor(text: string) {
        this.text = text
        this.cursor = 0
    }

    public getRemainingText(info: any = undefined) {
        if(this.isEOF()) {
            // console.log("tagStack", this.tagStack, info)
            throw new EOLError("Hit EOL but was not expecting it")
        }
        return this.text.substring(this.cursor)
    }

    public getSnippet(begin: number, end: number) {
        return this.text.substring(begin, end)
    }

    public getCursor() {
        return this.cursor
    }

    public isEOF(debug: boolean = false) {
        if(debug) console.log(`${this.cursor} >= ${this.text.length}`, this.cursor >= this.text.length)
        return this.cursor > this.text.length - 1
    }

    public lookAhead(tokenType: TokenConstructor ) {
        if(this.isEOF()) return false
        const text = this.getRemainingText(tokenType.name)
        const token = new tokenType()
        if(token.regex.test(text)) {
            this.lookAheadTokenType = tokenType
            return true
        }
        return false 
    }

    public consumeLookAhead() {
        if(this.lookAheadTokenType === undefined) throw new Error("Tried to consume lookAhead but is was undefined")
        return this.consume(this.lookAheadTokenType)
    }

    public consume<T extends Token>(tokenType: new (...args: any) => T): T {
        const text = this.getRemainingText(tokenType.name)
        const begin = this.cursor
        const token = new tokenType()
        const match = token.regex.exec(text)
        if(match === null) {
            console.log("HTML: " + this.getRemainingText().substring(0, 150) + "...")
            throw new Error(`Trying to consume [${tokenType.name}]`)
        }
        const value = match[1]
        token.value = value
        this.cursor += value.length
        const end = this.cursor
        this.lookAheadTokenType = undefined
        token.position = {begin, end}
        this.tagStack.push(token)
        return token
    }

    public lazyConsume<T extends Token>(tokenType: new (...args: any) => T): T|undefined {
        if(this.lookAhead(tokenType)) {
            return <T>this.consumeLookAhead()
        }
        return undefined
    }

    public debug() {
        console.log("cursor: ", this.cursor)
        console.log("text length: ", this.text.length)
    }
}