import { Token } from "../Token"

export class WhitespaceToken extends Token { public regex: RegExp = /^(\s*)/ }
export class AnyCharacterToken extends Token { public regex: RegExp = /^([\s\S])/ }

export class CallbackSignatureToken extends Token { public regex: RegExp = /^((?:\(\s*[a-zA-Z0-9_-]*(?:\s*,\s*[a-zA-Z0-9_-]+)*\s*\)|[a-zA-Z0-9_-]+)\s*=>)/ }

export class LParenToken extends Token { public regex: RegExp = /^(\()/ }
export class RParenToken extends Token { public regex: RegExp = /^(\))/ }
export class LBraceToken extends Token { public regex: RegExp = /^({)/ }
export class RBraceToken extends Token { public regex: RegExp = /^(})/ }
export class LBracketToken extends Token { public regex: RegExp = /^(\[)/ }
export class RBracketToken extends Token { public regex: RegExp = /^(\])/ }

export class DotToken extends Token { public regex: RegExp = /^(\.)/ }
export class ColonToken extends Token { public regex: RegExp = /^(:)/ }

export class ObjectPathPartToken extends Token { public regex: RegExp = /^([a-zA-Z0-9_-]+)/ }
export class ObjectFunctionPathPartToken extends Token { public regex: RegExp = /^([a-zA-Z0-9_-]+\()/ }
export class AssignmentToken extends Token { public regex: RegExp = /^(=)/ }
export class CommaToken extends Token { public regex: RegExp = /^(,)/ }

export class QuestionMarkToken extends Token { public regex: RegExp = /^(\?)/ }
export class ExclamationMarkToken extends Token { public regex: RegExp = /^(\!)/ }

export class DivisionToken extends Token { public regex: RegExp = /^(\/)/ }
export class MultiplicationToken extends Token { public regex: RegExp = /^(\*)/ }
export class ModuloToken extends Token { public regex: RegExp = /^(\%)/ }
export class SpreadToken extends Token { public regex: RegExp = /^(\.\.\.)/ }

export class IsEqualToken extends Token { public regex: RegExp = /^(==)/ }
export class IsNotEqualToken extends Token { public regex: RegExp = /^(!=)/ }
export class LessThanOrEqualToken extends Token { public regex: RegExp = /^(<=)/ }
export class MoreThanOrEqualToken extends Token { public regex: RegExp = /^(>=)/ }
export class LessThanToken extends Token { public regex: RegExp = /^(<)/ }
export class MoreThanToken extends Token { public regex: RegExp = /^(>)/ }
export class PlusToken extends Token { public regex: RegExp = /^(\+)/ }
export class MinusToken extends Token { public regex: RegExp = /^(\-)/ }


export class LogicalAndToken extends Token { public regex: RegExp = /^(\&\&|and)/ }
export class LogicalOrToken extends Token { public regex: RegExp = /^(\|\||or)/ }

export class StringSingleQuotedStartToken extends Token { public regex: RegExp = /^(')/ }
export class StringDoubleQuotedStartToken extends Token { public regex: RegExp = /^(")/ }
export class StringDoubleQuotedToken extends Token { public regex: RegExp = /^("[^"\\\\]*(?:\\.[^"\\\\]*)*")/ }
export class StringSingleQuotedToken extends Token { public regex: RegExp = /^('[^'\\\\]*(?:\\.[^'\\\\]*)*')/ }



export class TrueValueToken extends Token { public regex: RegExp = /^(true|TRUE)/ }
export class FalseValueToken extends Token { public regex: RegExp = /^(false|FALSE)/ }
export class NullValueToken extends Token { public regex: RegExp = /^(null|NULL)/ }
export class IntegerToken extends Token { public regex: RegExp = /^(-?[0-9]+)/ }
export class FloatToken extends Token { public regex: RegExp = /^(-?[0-9]+\.[0-9]+)/ }
