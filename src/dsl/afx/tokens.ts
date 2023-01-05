import { Token } from "../Token"


export type TokenConstructor = new (...args: any) => Token

export class TagBeginToken extends Token { public regex: RegExp = /^(<[a-zA-Z0-9.:]+)/}
export class TagEndToken extends Token { public regex: RegExp = /^(<\/[a-zA-Z0-9.:]+>)/ }
export class TagCloseToken extends Token { public regex: RegExp = /^(>)/ }
export class TagSelfCloseToken extends Token { public regex: RegExp = /^(\/>)/ }

export class AttributeNameToken extends Token { public regex: RegExp = /^([a-zA-Z0-9@.:-]+)/ }
export class AttributeValueAssignToken extends Token { public regex: RegExp = /^(=)/ }
export class AttributeStringValueToken extends Token { public regex: RegExp = /^((?:"[^"]*")|(?:'[^']*'))/ }
export class AttributeEelBeginToken extends Token { public regex: RegExp = /^({)/ }
export class AttributeEelEndToken extends Token { public regex: RegExp = /^(})/ }

export class CommentToken extends Token { public regex: RegExp = /^(<![^>]*>)/ }

export class WordToken extends Token { public regex: RegExp = /^(\w+)/ }
export class CharacterToken extends Token { public regex: RegExp = /^([^<])/ }
export class EscapedCharacterToken extends Token { public regex: RegExp = /^(&\w+;)/ }

export class ScriptEndToken extends Token { public regex: RegExp = /^(<\/script>)/ }


export class WhitespaceToken extends Token { public regex: RegExp = /^(\s*)/ }
export class AnyCharacterToken extends Token { public regex: RegExp = /^([\s\S])/ }
