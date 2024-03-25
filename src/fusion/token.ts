export class Token {
    public static readonly EOF = 1;

    public static readonly SLASH_COMMENT = 2;
    public static readonly HASH_COMMENT = 3;
    public static readonly MULTILINE_COMMENT = 4;

    public static readonly SPACE = 5;
    public static readonly NEWLINE = 6;

    public static readonly INCLUDE = 7;
    public static readonly NAMESPACE = 8;

    public static readonly META_PATH_START = 9;
    public static readonly OBJECT_PATH_PART = 10;
    public static readonly PROTOTYPE_START = 11;

    public static readonly ASSIGNMENT = 12;
    public static readonly COPY = 13;
    public static readonly UNSET = 14;

    public static readonly FUSION_OBJECT_NAME = 15;

    public static readonly TRUE_VALUE = 16;
    public static readonly FALSE_VALUE = 17;
    public static readonly NULL_VALUE = 18;

    public static readonly INTEGER = 19;
    public static readonly FLOAT = 20;

    public static readonly STRING_DOUBLE_QUOTED = 21;
    public static readonly STRING_SINGLE_QUOTED = 22;

    public static readonly EEL_EXPRESSION = 23;
    public static readonly DSL_EXPRESSION_START = 24;
    public static readonly DSL_EXPRESSION_CONTENT = 25;

    public static readonly FILE_PATTERN = 26;

    public static readonly DOT = 27;
    public static readonly COLON = 28;
    public static readonly R_PARENTHESIS = 29;
    public static readonly LBRACE = 30;
    public static readonly RBRACE = 31;

    public static readonly EEL_EXPRESSION_START = 691
    public static readonly STRING_DOUBLE_QUOTED_START = 692;
    public static readonly STRING_SINGLE_QUOTED_START = 693;
    public static readonly EEL_EXPRESSION_FUNCTION_PATH = 694
    public static readonly L_PARENTHESIS = 695
    public static readonly COMMA = 696
    public static readonly EEL_EXPRESSION_OBJECT_PATH = 697
    public static readonly EEL_EXPRESSION_OBJECT_PATH_PART = 698
    public static readonly LBRACKET = 699;
    public static readonly RBRACKET = 700;
    public static readonly EEL_EXPRESSION_CALLBACK = 701
    // public static readonly DOCUMENTATION_SINGLE_LINE = 702

    private static ConstantsMap: { [key: number]: string } | undefined = undefined

    protected type: number
    protected value: string
    protected name: string

    public constructor(type: number, value: string) {
        this.type = type
        this.value = value
        this.name = Token.typeToString(type)
    }

    public getType(): number {
        return this.type;
    }

    public getValue(): string {
        return this.value;
    }

    public static typeToString(type: number): string {
        const stringRepresentation = Token.getConstants()[type]

        if (stringRepresentation === undefined) {
            throw Error(`Token of type '{type}' does not exist`)
            // throw new \LogicException("Token of type 'type' does not exist", 1637307344);
        }
        return stringRepresentation;
    }

    private static getConstants() {
        if (this.ConstantsMap === undefined) {
            const propertyNames = Object.getOwnPropertyNames(this).filter(name => !['length', 'prototype', 'name',].includes(name))
            const descriptors = Object.getOwnPropertyDescriptors(this)

            this.ConstantsMap = {}
            for (const propertyName of propertyNames) {
                this.ConstantsMap[descriptors[propertyName].value] = propertyName
            }
        }

        return this.ConstantsMap
    }
}