export class Token {
    public static EOF: number = 1;

    public static SLASH_COMMENT: number = 2;
    public static HASH_COMMENT: number = 3;
    public static MULTILINE_COMMENT: number = 4;

    public static SPACE: number = 5;
    public static NEWLINE: number = 6;

    public static INCLUDE: number = 7;
    public static NAMESPACE: number = 8;

    public static META_PATH_START: number = 9;
    public static OBJECT_PATH_PART: number = 10;
    public static PROTOTYPE_START: number = 11;

    public static ASSIGNMENT: number = 12;
    public static COPY: number = 13;
    public static UNSET: number = 14;

    public static FUSION_OBJECT_NAME: number = 15;

    public static TRUE_VALUE: number = 16;
    public static FALSE_VALUE: number = 17;
    public static NULL_VALUE: number = 18;

    public static INTEGER: number = 19;
    public static FLOAT: number = 20;

    public static STRING_DOUBLE_QUOTED: number = 21;
    public static STRING_SINGLE_QUOTED: number = 22;

    public static EEL_EXPRESSION: number = 23;
    public static DSL_EXPRESSION_START: number = 24;
    public static DSL_EXPRESSION_CONTENT: number = 25;

    public static FILE_PATTERN: number = 26;

    public static DOT: number = 27;
    public static COLON: number = 28;
    public static RPAREN: number = 29;
    public static LBRACE: number = 30;
    public static RBRACE: number = 31;

    public static EEL_EXPRESSION_START: number = 691
    public static STRING_DOUBLE_QUOTED_START: number = 692;
    public static STRING_SINGLE_QUOTED_START: number = 693;
    public static EEL_EXPRESSION_FUNCTION_PATH: number = 694
    public static LPAREN: number = 695
    public static COMMA: number = 696
    public static EEL_EXPRESSION_OBJECT_PATH: number = 697
    public static EEL_EXPRESSION_OBJECT_PATH_PART: number = 698
    public static LBRACKET: number = 699;
    public static RBRACKET: number = 700;
    public static EEL_EXPRESSION_CALLBACK: number = 701

    private static ConstantsMap: Map<number, string> | null = null

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

    /**
     * Returns the constant representation of a given type.
     *
     * @param {number} type The type as an integer
     *
     * @return string The string representation
     * @throws \LogicException
     */
    public static typeToString(type: number): string {
        const constants = Token.getConstants()

        if (!constants!.has(type)) {
            throw Error(`Token of type '{type}' does not exist`)
            // throw new \LogicException("Token of type 'type' does not exist", 1637307344);
        }
        return constants!.get(type)!
    }

    private static getConstants(): Map<number, string> {
        if (this.ConstantsMap === null) {
            const propertyNames = Object.getOwnPropertyNames(this).filter(name => !['length', 'prototype', 'name',].includes(name))
            const descriptors = Object.getOwnPropertyDescriptors(this)

            this.ConstantsMap = new Map
            for (const propertyName of propertyNames) {
                this.ConstantsMap.set(descriptors[propertyName].value, propertyName)
            }
        }

        return this.ConstantsMap
    }
}