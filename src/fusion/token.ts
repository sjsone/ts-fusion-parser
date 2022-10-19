export class Token {
    public static EOF = 1;

    public static SLASH_COMMENT = 2;
    public static HASH_COMMENT = 3;
    public static MULTILINE_COMMENT = 4;

    public static SPACE = 5;
    public static NEWLINE = 6;

    public static INCLUDE = 7;
    public static NAMESPACE = 8;

    public static META_PATH_START = 9;
    public static OBJECT_PATH_PART = 10;
    public static PROTOTYPE_START = 11;

    public static ASSIGNMENT = 12;
    public static COPY = 13;
    public static UNSET = 14;

    public static FUSION_OBJECT_NAME = 15;

    public static TRUE_VALUE = 16;
    public static FALSE_VALUE = 17;
    public static NULL_VALUE = 18;

    public static INTEGER = 19;
    public static FLOAT = 20;

    public static STRING_DOUBLE_QUOTED = 21;
    public static STRING_SINGLE_QUOTED = 22;

    public static EEL_EXPRESSION = 23;
    public static DSL_EXPRESSION_START = 24;
    public static DSL_EXPRESSION_CONTENT = 25;

    public static FILE_PATTERN = 26;

    public static DOT = 27;
    public static COLON = 28;
    public static RPAREN = 29;
    public static LBRACE = 30;
    public static RBRACE = 31;

    public static EEL_EXPRESSION_START = 691
    public static STRING_DOUBLE_QUOTED_START = 692;
    public static STRING_SINGLE_QUOTED_START = 693;
    public static EEL_EXPRESSION_FUNCTION_PATH = 694
    public static LPAREN = 695
    public static COMMA = 696
    public static EEL_EXPRESSION_OBJECT_PATH = 697
    public static EEL_EXPRESSION_OBJECT_PATH_PART = 698
    public static LBRACKET = 699;
    public static RBRACKET = 700;
    public static EEL_EXPRESSION_CALLBACK = 701

    protected type: number
    protected value: string
    protected name: string

    public constructor(type: number, value: string) {
        this.type = type
        this.value = value
        this.name = Token.typeToString(type)
    }

    public getType(): number
    {
        return this.type;
    }

    public getValue(): string
    {
        return this.value;
    }

    /**
     * Returns the constant representation of a given type.
     *
     * @param {number} type The type as an integer
     *
     * @return string The string representation
     * @throws \LogicException
     */
    public static typeToString(type: number): string
    {
        const stringRepresentation = Token.getConstants()[type]
        
        if (stringRepresentation === undefined) {
            throw Error(`Token of type '{type}' does not exist`)
            // throw new \LogicException("Token of type 'type' does not exist", 1637307344);
        }
        return stringRepresentation;
    }

    protected static getConstants()
    {
        const propertyNames = Object.getOwnPropertyNames(this).filter(name => !['length', 'prototype', 'name',].includes(name))
        const descriptors = Object.getOwnPropertyDescriptors(this)

        const constants: {[key: number]: string} = {}
        for(const propertyName of propertyNames) {
            constants[descriptors[propertyName].value] = propertyName
        }
        return constants
    }
}