import { stat } from "fs";
import { Lexer } from "../lexer";
import { AbstractNode } from "../objectTreeParser/ast/AbstractNode";
import { AbstractStatement } from "../objectTreeParser/ast/AbstractStatement";
import { StatementList } from "../objectTreeParser/ast/StatementList";
import { ObjectTreeParser } from "../objectTreeParser/objectTreeParser";
import { Token } from "../token";
import { StringLiteralEELNode } from "./ast/StringLiteralEELNode";

export class EELParser {
    protected lexer: Lexer;

    protected ignoreErrors: boolean
    protected ignoredErrors: Error[] = []

    protected stack: number[] = []

    protected constructor(lexer: Lexer, ignoreErrors: boolean = false) {
        this.lexer = lexer;
        this.ignoreErrors = ignoreErrors
    }

    public static parse(sourceCode: string, contextPathAndFilename: string | undefined = undefined, ignoreErrors: boolean = false) {
        const lexer = new Lexer(sourceCode);
        const parser = new EELParser(lexer);
        return parser.parseEEL();
    }

    public parseEEL() {
        this.expect(Token.EEL_EXPRESSION_START)
        this.stack.push(Token.LBRACE)
        this.lazyBigGap();
        return this.parseStatement()
        
    }

    protected parseStatementList(stopLookahead: number | null = null, debugName: string = "") {
        const statements = [];
        this.lazyBigGap();

        while (this.accept(Token.EOF) === false && (stopLookahead === null || this.accept(stopLookahead) === false) && this.stack.length > 0) {
            let statement
            try {
                statement = this.parseStatement()
                console.log("statement", statement)
                statements.push(statement)
                this.lazyBigGap();
                this.lexer.debug()
                if(!this.lazyExpect(Token.COMMA)) {
                    console.log("no comma found", this.stack)
                    break
                }
                console.log("Found expected comma", )
                this.lazyBigGap();
                
            } catch (e) {
                if (!this.ignoreErrors) {
                    throw e
                } else {
                    this.ignoredErrors.push(<Error>e)
                }
                break;
            }
            if(this.getLastStackItem() === Token.LBRACE && this.accept(Token.RBRACE)) {
                this.consume()
                this.stack.pop()
                console.log("this stack", this.stack)
            }
        }

        return statements;
    }

    protected parsePathSegment() {
        switch (true) {
            case this.accept(Token.OBJECT_PATH_PART):
                const pathKey = this.consume().getValue();
                return pathKey;


        }

        throw Error("Could not parse segment")
    }

    protected getLastStackItem(): undefined | number {
        if (this.stack.length === 0) return undefined
        return this.stack[this.stack.length - 1]
    }

    protected parseString(stringToken: Token) {
        const text = this.lexer.consumeUntil(stringToken.getType())
        this.expect(stringToken.getType())
        return new StringLiteralEELNode(text)
    }

    protected parseFunctionCall(path: string): any {
        console.group(`[${path}]()`)
        console.log("parsing function call")

        const test = this.parseStatementList(Token.RPAREN)
        // console.log("parsed Function Call", test)
        console.groupEnd()
        return test
    }

    protected parseObjectLiteral() {
        const stopLookahead = Token.RPAREN
        const entries = []
        while (!this.accept(Token.EOF) && !this.accept(stopLookahead)) {
            this.lazyBigGap();
            const entry = this.parseObjectEntry()
            entries.push(entry)
            this.lazyBigGap();
            this.lexer.debug()
            if(!this.lazyExpect(Token.COMMA)) {
                break;
            }
            
        }
        return {
            type: "object",
            entries
        }
    }

    protected parseObjectEntry(): any {
        let key = null
        switch (true) {
            case this.accept(Token.STRING_SINGLE_QUOTED_START):
            case this.accept(Token.STRING_DOUBLE_QUOTED_START):
                key = this.parseString(this.consume())
        }
        this.lazySmallGap()
        this.expect(Token.COLON)
        this.lazySmallGap()
        const statement = this.parseStatement()

        console.log("key", key)
        console.log("statement", statement)

        return {key, statement}
    }

    protected parseStatement() {
        // watch out for the order, its regex matching and first one wins.
        switch (true) {
            case this.accept(Token.STRING_SINGLE_QUOTED_START):
            case this.accept(Token.STRING_DOUBLE_QUOTED_START):
                return this.parseString(this.consume())
            case this.accept(Token.EEL_EXPRESSION_FUNCTION_PATH):
                const functionToken = this.consume()
                const path = functionToken.getValue().slice(0, -1)
                this.stack.push(Token.LPAREN)

                // console.log("function path", path)
                const args = this.parseFunctionCall(path)
                this.lazyExpect(Token.RPAREN)
                return {path, args}

            case this.accept(Token.FUSION_OBJECT_NAME):
                const objectToken = this.consume()
                // console.log(objectToken)
                return objectToken.getValue()

            case this.accept(Token.LBRACE):
                this.consume()
                this.stack.push(Token.LBRACE)
                const obj = this.parseObjectLiteral()
                this.lazyExpect(Token.RBRACE)
                return obj


        }

        if (!this.ignoreErrors) console.log("parseStatement")
        if (!this.ignoreErrors) this.lexer.debug()
        throw Error("Error while parsing statement")
    }

    protected parseObjectPath() {
        const segments = [];
        do {
            const segment = this.parsePathSegment()
            segments.push(segment);
        } while (this.lazyExpect(Token.DOT));
        return segments
    }

    protected accept(tokenType: number, debug = false): boolean {
        const token = this.lexer.getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType, debug);
        if (token === null) {
            return false;
        }
        return token.getType() === tokenType;
    }

    /**
     * Expects a token of a given type.
     * The Lexer will look up the regex for the token and try to match it on the current string.
     * First match wins.
     *
     * @param {number} tokenType
     * @return Token
     * @throws ParserUnexpectedCharException
     */
    protected expect(tokenType: number): Token {
        const token = this.lexer.getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType);
        if (token === null || token.getType() !== tokenType) {
            throw Error(`Expected token: '${Token.typeToString(tokenType)}'.`)
            // throw new ParserUnexpectedCharException("Expected token: 'tokenReadable'.", 1646988824);
        }
        return this.lexer.consumeLookahead();
    }

    /**
     * Checks, if the token type matches the current, if so consume it and return true.
     * @param {number} tokenType
     * @return bool|null
     */
    protected lazyExpect(tokenType: number, debug = false): boolean {
        const token = this.lexer.getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType, debug);
        if(debug) console.log("token", token)
        if (token === null || token.getType() !== tokenType) {
            return false;
        }
        this.lexer.consumeLookahead();
        return true;
    }

    /**
     * OptionalBigGap
     *  = ( NEWLINE / OptionalSmallGap )*
     */
    protected lazyBigGap(): void {
        while (true) {
            switch (true) {
                case this.accept(Token.SPACE):
                case this.accept(Token.NEWLINE):
                case this.accept(Token.SLASH_COMMENT):
                case this.accept(Token.HASH_COMMENT):
                case this.accept(Token.MULTILINE_COMMENT):
                    this.consume();
                    break;

                default:
                    return;
            }
        }
    }

    /**
     * OptionalSmallGap
     *  = ( SPACE / SLASH_COMMENT / HASH_COMMENT / MULTILINE_COMMENT )*
     */
    protected lazySmallGap(): void {
        while (true) {
            switch (true) {
                case this.accept(Token.SPACE):
                case this.accept(Token.SLASH_COMMENT):
                case this.accept(Token.HASH_COMMENT):
                    // case this.accept(Token.MULTILINE_COMMENT):
                    this.consume();
                    break;

                default:
                    return;
            }
        }
    }

    protected consume(): Token {
        return this.lexer.consumeLookahead();
    }

}