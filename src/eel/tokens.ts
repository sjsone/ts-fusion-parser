export abstract class Token {
    public abstract regex: RegExp
    public value: string = ""
    public position = {
        begin: -1,
        end: -1
    }
}

export type TokenConstructor = new (...args: any) => Token

export class WhitespaceToken extends Token { public regex = /^(\s*)/ }
export class AnyCharacterToken extends Token { public regex = /^([\s\S])/ }

export class LParenToken extends Token { public regex = /^(\()/ }
export class RParenToken extends Token { public regex = /^(\))/ }
export class LBraceToken extends Token { public regex = /^({)/ }
export class RBraceToken extends Token { public regex = /^(})/ }
export class LBracketToken extends Token { public regex = /^(\[)/ }
export class RBracketToken extends Token { public regex = /^(\])/ }

export class DotToken extends Token { public regex = /^(\.)/ }
export class ColonToken extends Token { public regex = /^(:)/ }

export class ObjectPathPartToken extends Token { public regex = /^([a-zA-Z]+)/ }
export class ObjectFunctionPathPartToken extends Token { public regex = /^([a-zA-Z]+\()/ }
export class AssignmentToken extends Token { public regex = /^(=)/ }
export class CommaToken extends Token { public regex = /^(,)/ }
export class IsEqualToken extends Token { public regex = /^(==)/ }
export class IsNotEqualToken extends Token { public regex = /^(!=)/ }
export class QuestionMarkToken extends Token { public regex = /^(\?)/ }
export class ExclamationMarkToken extends Token { public regex = /^(\!)/ }
export class PlusToken extends Token { public regex = /^(\+)/ }
export class MinusToken extends Token { public regex = /^(\-)/ }

export class StringSingleQuotedStartToken extends Token { public regex = /^(')/ }
export class StringDoubleQuotedStartToken extends Token { public regex = /^(")/ }
export class StringDoubleQuotedToken extends Token { public regex = /^("[^"\\\\]*(?:\\.[^"\\\\]*)*")/ }
export class StringSingleQuotedToken extends Token { public regex = /^('[^'\\\\]*(?:\\.[^'\\\\]*)*')/ }

export class LogicalAndToken extends Token { public regex = /^(\&\&)/ }
export class LogicalOrToken extends Token { public regex = /^(\|\|)/ }

export class TrueValueToken extends Token { public regex = /^((?=(true|TRUE))\1)/ }
export class FalseValueToken extends Token { public regex = /^((?=(false|FALSE))\1)/ }
export class NullValueToken extends Token { public regex = /^((?=(null|NULL))\1)/ }
export class IntegerToken extends Token { public regex = /^(-?[0-9]+)/ }
export class FloatToken extends Token { public regex = /^(-?[0-9]+\.[0-9]+)/ }