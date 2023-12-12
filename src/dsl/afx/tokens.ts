import { Token } from "../Token"


export type TokenConstructor = new (...args: any) => Token

export class TagBeginToken extends Token { public regex = /^(<[a-zA-Z0-9.:-]+)/}
export class TagEndToken extends Token { public regex = /^(<\/[a-zA-Z0-9.:-]+>)/ }
export class TagCloseToken extends Token { public regex = /^(>)/ }
export class TagSelfCloseToken extends Token { public regex = /^(\/>)/ }

export class AttributeNameToken extends Token { public regex = /^((?:[a-zA-Z0-9@.:-]+)|(?:'[a-zA-Z0-9@.:-]+')|(?:"[a-zA-Z0-9@.:-]+"))/ }
export class AttributeValueAssignToken extends Token { public regex = /^(=)/ }
export class AttributeStringValueToken extends Token { public regex = /^((?:"[^"]*")|(?:'[^']*'))/ }
export class AttributeEelBeginToken extends Token { public regex = /^({)/ }
export class AttributeEelEndToken extends Token { public regex = /^(})/ }

export class CommentToken extends Token { public regex = /^(<!-- ?[\S\s]*? ?-->)/ }

export class WordToken extends Token { public regex = /^(\w+)/ }
export class CharacterToken extends Token { public regex = /^([^<])/ }
export class EscapedCharacterToken extends Token { public regex = /^(&\w+;)/ }

export class ScriptEndToken extends Token { public regex = /^(<\/script>)/ }


export class WhitespaceToken extends Token { public regex = /^(\s+)/ }
export class AnyCharacterToken extends Token { public regex = /^([\s\S])/ }
