import { Token } from "../Token"

export class WhitespaceToken extends Token { public regex = /^(\s+)/ }
export class AnyCharacterToken extends Token { public regex = /^([\s\S])/ }

export class CallbackSignatureToken extends Token { public regex = /^((?:\(\s*[a-zA-Z0-9_-]*(?:\s*,\s*[a-zA-Z0-9_-]+)*\s*\)|[a-zA-Z0-9_-]+)\s*=>)/ }

export class LParenToken extends Token { public regex = /^(\()/ }
export class RParenToken extends Token { public regex = /^(\))/ }
export class LBraceToken extends Token { public regex = /^({)/ }
export class RBraceToken extends Token { public regex = /^(})/ }
export class LBracketToken extends Token { public regex = /^(\[)/ }
export class RBracketToken extends Token { public regex = /^(\])/ }

export class DotToken extends Token { public regex = /^(\.)/ }
export class ColonToken extends Token { public regex = /^(:)/ }

export class ObjectPathPartToken extends Token { public regex = /^([a-zA-Z0-9_-]+)/ }
export class ObjectFunctionPathPartToken extends Token { public regex = /^([a-zA-Z0-9_-]+\()/ }
export class AssignmentToken extends Token { public regex = /^(=)/ }
export class CommaToken extends Token { public regex = /^(,)/ }

export class QuestionMarkToken extends Token { public regex = /^(\?)/ }
export class ExclamationMarkToken extends Token { public regex = /^(\!)/ }

export class DivisionToken extends Token { public regex = /^(\/)/ }
export class MultiplicationToken extends Token { public regex = /^(\*)/ }
export class ModuloToken extends Token { public regex = /^(\%)/ }
export class SpreadToken extends Token { public regex = /^(\.\.\.)/ }

export class IsEqualToken extends Token { public regex = /^(==)/ }
export class IsNotEqualToken extends Token { public regex = /^(!=)/ }
export class LessThanOrEqualToken extends Token { public regex = /^(<=)/ }
export class MoreThanOrEqualToken extends Token { public regex = /^(>=)/ }
export class LessThanToken extends Token { public regex = /^(<)/ }
export class MoreThanToken extends Token { public regex = /^(>)/ }
export class PlusToken extends Token { public regex = /^(\+)/ }
export class MinusToken extends Token { public regex = /^(\-)/ }


export class LogicalAndToken extends Token { public regex = /^(\&\&|and)/ }
export class LogicalOrToken extends Token { public regex = /^(\|\||or)/ }

export class StringSingleQuotedStartToken extends Token { public regex = /^(')/ }
export class StringDoubleQuotedStartToken extends Token { public regex = /^(")/ }
export class StringDoubleQuotedToken extends Token { public regex = /^("[^"\\\\]*(?:\\.[^"\\\\]*)*")/ }
export class StringSingleQuotedToken extends Token { public regex = /^('[^'\\\\]*(?:\\.[^'\\\\]*)*')/ }



export class TrueValueToken extends Token { public regex = /^(true|TRUE)/ }
export class FalseValueToken extends Token { public regex = /^(false|FALSE)/ }
export class NullValueToken extends Token { public regex = /^(null|NULL)/ }
export class IntegerToken extends Token { public regex = /^(-?[0-9]+)/ }
export class FloatToken extends Token { public regex = /^(-?[0-9]+\.[0-9]+)/ }
