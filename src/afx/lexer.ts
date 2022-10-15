import { Token, TokenConstructor } from "./tokens";



export class Lexer {
    protected text: string
    protected cursor: number = -1
    protected lookAheadTokenType: TokenConstructor|undefined

    constructor(text: string) {
        this.text = text
        this.cursor = 0
    }

    public getRemainingText() {
        if(this.isEOF()) throw new Error("Hit EOL but was not expecting it")
        return this.text.substring(this.cursor)
    }

    public isEOF(debug: boolean = false) {
        if(debug) console.log(`${this.cursor} >= ${this.text.length}`, this.cursor >= this.text.length)
        return this.cursor >= this.text.length - 1
    }

    public lookAhead(tokenType: TokenConstructor ) {
        const text = this.getRemainingText()
        const token = new tokenType()
        if(token.regex.test(text)) {
            this.lookAheadTokenType = tokenType
            return true
        }
        return false 
    }

    public consumeLookAhead() {
        if(this.lookAheadTokenType === undefined) throw new Error("Tryed to consume lookAhead but is was undefined")
        return this.consume(this.lookAheadTokenType)
    }

    public consume<T extends Token>(tokenType: new (...args: any) => T): T {
        const text = this.getRemainingText()
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