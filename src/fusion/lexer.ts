import { Token } from "./token";
import NodeProcess from "process"

export class Lexer {
    // Difference to: Neos\Eel\Package.EelExpressionRecognizer
    // added an atomic group (to prevent catastrophic backtracking) and removed the end anchor 
    // protected static PATTERN_EEL_EXPRESSION = `^\\\${(?<exp>(>{ (>exp) }|[^{}"']+|"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|'[^'\\\\]*(?:\\\\.[^'\\\\]*)*')*)}`;
    protected static PATTERN_EEL_EXPRESSION = `^\\\${(.*)}(?=\\s*\\n)`;

    protected mode = "fusion"


    public static TOKEN_REGEX: { [key: number]: string } = {
        [Token.SLASH_COMMENT]: '^\\/\\/.*',
        [Token.HASH_COMMENT]: '^#.*',

        [Token.MULTILINE_COMMENT]: `^\\/\\*[^*]*(?:\\*[^/][^*]*)*\\*\\/`,

        [Token.NEWLINE]: '^[\\n\\r]+',
        [Token.SPACE]: '^[ \\t]+',

        // VALUE ASSIGNMENT
        [Token.TRUE_VALUE]: '^(?=(true|TRUE))\\1',
        [Token.FALSE_VALUE]: '^(?=(false|FALSE))\\1',
        [Token.NULL_VALUE]: '^(?=(null|NULL))\\1',
        [Token.INTEGER]: '^-?[0-9]+',
        [Token.FLOAT]: '^-?[0-9]+\.[0-9]+',

        [Token.DSL_EXPRESSION_START]: '^[a-zA-Z0-9\.]+(?=`)', // '/^[a-zA-Z0-9\.]++(?=`)/'
        [Token.DSL_EXPRESSION_CONTENT]: '^`[^`]*`', // /^`[^`]*+`/
        [Token.EEL_EXPRESSION]: Lexer.PATTERN_EEL_EXPRESSION,
        // Object type part
        [Token.FUSION_OBJECT_NAME]: '^[0-9a-zA-Z.]+(?::[0-9a-zA-Z.]+)?',
        // Keywords
        [Token.INCLUDE]: '^include\\s*:',
        // Object path segments
        [Token.PROTOTYPE_START]: '^prototype\\(',
        [Token.META_PATH_START]: '^@',
        [Token.OBJECT_PATH_PART]: '^[a-zA-Z0-9_:-]+',
        // Operators
        [Token.ASSIGNMENT]: '^=',
        [Token.COPY]: '^<',
        [Token.UNSET]: '^>',
        // Symbols
        [Token.DOT]: '^\\.',
        [Token.COLON]: '^:',
        [Token.RPAREN]: '^\\)',
        [Token.LBRACE]: '^{',
        [Token.RBRACE]: '^}',
        [Token.LBRACKET]: '^\\[',
        [Token.RBRACKET]: '^\\]',
        

        // Strings

        [Token.STRING_DOUBLE_QUOTED]: `^"[^"\\\\\\\\]*(?:\\\\.[^"\\\\\\\\]*)*"`,

        [Token.STRING_SINGLE_QUOTED]: `^'[^'\\\\\\\\]*(?:\\\\.[^'\\\\\\\\]*)*'`,

        [Token.FILE_PATTERN]: '^[a-zA-Z0-9.*:/_-]+',

        [Token.EEL_EXPRESSION_START]: `^\\\${`,
        [Token.STRING_SINGLE_QUOTED_START]: `^'`,
        [Token.STRING_DOUBLE_QUOTED_START]: `^"`,
        [Token.EEL_EXPRESSION_FUNCTION_PATH]: `^([0-9a-zA-Z])+(?:\\.[0-9a-zA-Z]+)*\\(`,
        [Token.EEL_EXPRESSION_OBJECT_PATH]: `^([0-9a-zA-Z])+(?:\\.[0-9a-zA-Z]+)*`,
        [Token.EEL_EXPRESSION_OBJECT_PATH_PART]: `^[0-9a-zA-Z]+`,
        [Token.EEL_EXPRESSION_CALLBACK]: `^\\(([a-zA-Z]+(?:\\s*,\\s*[a-zA-Z]+)*)\\)\\s*=>`,
        
        [Token.LPAREN]: '^\\(',
        [Token.COMMA]: '^,',
    };
    protected code: string = '';
    protected codeLen: number = 0;
    protected cursor: number = 0;
    protected lookahead: Token | null = null;

    public constructor(code: string) {
        code = code.replace("\r", "\n",).replace("\r\n", "\n");
        this.code = code;
        this.codeLen = code.length;
    }

    public getCode(): string {
        return this.code;
    }

    public getCursor(): number {
        return this.cursor;
    }

    public advanceCursor(amount: number) {
        this.cursor += amount
        this.lookahead = null
    }

    public getRemainingCode(): string {
        return this.code.substring(this.cursor)
    }

    public consumeLookahead(): Token {
        const token = <Token>this.lookahead;
        this.lookahead = null;
        return token;
    }

    public getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType: number, debug = false): Token | null {
        const logging = debug
        if (this.lookahead !== null) {
            return this.lookahead;
        }
        if (this.cursor === this.codeLen) {
            return this.lookahead = new Token(Token.EOF, '');
        }
        if (tokenType === Token.EOF) {
            return null;
        }

        const regexStringForToken = Lexer.TOKEN_REGEX[tokenType];
        if(logging) this.log("regexStringForToken", regexStringForToken);

        const remainingCode = this.code.substring(this.cursor)
        if(logging) this.log("remainingCode|"+remainingCode);
        const regexForToken = new RegExp(regexStringForToken, 'g')
        if(logging) this.log("regexForToken", regexForToken);
        const matches = regexForToken.exec(remainingCode)
        if(logging) this.log("matches", matches);
        if (matches === null) {
            return null;
        }

        this.cursor += matches[0].length;

        this.lookahead = new Token(tokenType, matches[0]);

        return this.lookahead
    }

    public consumeUntil(tokenType: number, logging: boolean = false): string {
        const regexStringForToken = Lexer.TOKEN_REGEX[tokenType];
        if(logging) this.log("regexStringForToken", regexStringForToken);
        const regexForToken = new RegExp(regexStringForToken, 'g')
        if(logging) this.log("regexForToken", regexForToken);

        let cursor = this.cursor
        let found = ''
        let next = this.code.substring(cursor)
        while(!regexForToken.test(next) && cursor < this.code.length) {
            if(logging) this.log("found:"+found, "next:"+next);
            found += next[0]
            next = next.substring(1)
            cursor++
        }
        if(logging) this.log("this.cursor", this.cursor);
        this.cursor += found.length 
        if(logging) this.log("this.cursor", this.cursor);

        this.lookahead = null

        return found;
    }

    debug() {
        this.log("remainingCode|"+ this.code.substring(this.cursor))
        // console.trace()
        // this.log("exiting...")
        // NodeProcess.exit()

    }

    protected log(...args: any[]) {
        console.log(this.mode, ...args)
    }
}