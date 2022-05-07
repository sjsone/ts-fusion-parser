import { Token } from "./token";
import NodeProcess from "process"

export class Lexer {
    // Difference to: Neos\Eel\Package.EelExpressionRecognizer
    // added an atomic group (to prevent catastrophic backtracking) and removed the end anchor 
    protected static PATTERN_EEL_EXPRESSION = /^\${(?<exp>(>{ (>exp) }|[^{}"']+|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')*)}/.toString();



    


    protected static TOKEN_REGEX: { [key: number]: string } = {
        [Token.SLASH_COMMENT]: '^\\/\\/.*',
        [Token.HASH_COMMENT]: '^#.*',

        // [Token.MULTILINE_COMMENT]: `^\/\*[^*]*(?:\*[^/][^*]*)*\*\/`,

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
        [Token.FUSION_OBJECT_NAME]: '^[0-9a-zA-Z.]+:[0-9a-zA-Z.]+',
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
        // Strings

        [Token.STRING_DOUBLE_QUOTED]: `^"[^"\\\\]*(?:\\.[^"\\\\]*)*"`,

        [Token.STRING_SINGLE_QUOTED]: `^'[^'\\\\]*(?:\\.[^'\\\\]*)*'`,

        [Token.FILE_PATTERN]: '`^[a-zA-Z0-9.*:/_-]+`',
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

    public consumeLookahead(): Token {
        const token = <Token>this.lookahead;
        this.lookahead = null;
        return token;
    }

    public getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType: number): Token | null {
        const logging = false // tokenType === Token.SPACE || tokenType === Token.ASSIGNMENT
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
        const remainingCode = this.code.substring(this.cursor)
        const regexForToken = new RegExp(regexStringForToken, 'g')
        const matches = regexForToken.exec(remainingCode)

        if (matches === null) {
            return null;
        }

        this.cursor += matches[0].length;

        this.lookahead = new Token(tokenType, matches[0]);

        return this.lookahead
    }
}