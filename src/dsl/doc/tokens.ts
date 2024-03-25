import { Token } from "../Token"


export type TokenConstructor = new (...args: any) => Token

export class CommaToken extends Token { public regex = /^(,)/ }
export class WhitespaceToken extends Token { public regex = /^(\s+)/ }
export class AnyCharacterToken extends Token { public regex = /^([\s\S])/ }
export class LeftParenthesisToken extends Token { public regex = /^(\()/ }
export class RightParenthesisToken extends Token { public regex = /^(\))/ }

export class SingleLineBeginToken extends Token { public regex = /^(\/\/\/ )/ }
export class TypeBeginToken extends Token { public regex = /^(<)/ }
export class TypeEndToken extends Token { public regex = /^(>)/ }
export class TypeOrToken extends Token { public regex = /^(\|)/ }

export class TypesArrayOffset extends Token { public regex = /^(\[\])/ }
export class TypesName extends Token { public regex = /^(\w+)/ }
export class TypesFqcn extends Token { public regex = /^((?:\\\w+)+)/ }



export class TypesGenericBeginToken extends Token { public regex = /^(<)/ }
export class TypesGenericEndToken extends Token { public regex = /^(>)/ }
