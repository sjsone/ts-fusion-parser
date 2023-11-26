import { AbstractPathSegment } from './nodes/AbstractPathSegment';
import { AbstractPathValue } from './nodes/AbstractPathValue';
import { AbstractStatement } from './nodes/AbstractStatement';
import { AssignedObjectPath } from './nodes/AssignedObjectPath';
import { Block } from './nodes/Block';
import { BoolValue } from './nodes/BoolValue';
import { DslExpressionValue } from './nodes/DslExpressionValue';
import { EelExpressionValue } from './nodes/EelExpressionValue';
import { FloatValue } from './nodes/FloatValue';
import { FusionFile } from './nodes/FusionFile';
import { FusionObjectValue } from './nodes/FusionObjectValue';
import { IncludeStatement } from './nodes/IncludeStatement';
import { IntValue } from './nodes/IntValue';
import { MetaPathSegment } from './nodes/MetaPathSegment';
import { NullValue } from './nodes/NullValue';
import { ObjectPath } from './nodes/ObjectPath';
import { ObjectStatement } from './nodes/ObjectStatement';
import { PathSegment } from './nodes/PathSegment';
import { PrototypePathSegment } from './nodes/PrototypePathSegment';
import { StatementList } from './nodes/StatementList';
import { StringValue } from './nodes/StringValue';
import { ValueAssignment } from './nodes/ValueAssignment';
import { ValueCopy } from './nodes/ValueCopy';
import { ValueUnset } from './nodes/ValueUnset';
import { Lexer } from './lexer'
import { Token } from './token';
import { NodePosition, NodePositionStub } from '../common/NodePosition';
import { AbstractNode } from '../common/AbstractNode';
import { EelParserOptions, Parser as EelParser } from '../dsl/eel/parser';
import { Lexer as EelLexer } from '../dsl/eel/lexer';
import { Comment } from '../common/Comment';
import { AfxParserOptions } from '../dsl/afx/parser';
import { IncompletePathSegment } from './nodes/IncompletePathSegment';
import { ParserError } from '../common/ParserError';


const stripslashes = (str: string) => str.replace('\\', '')
const stripcslashes = stripslashes // TODO: stripcslashes = stripslashes = uff

export interface FusionParserOptions {
    ignoreErrors: boolean
    afxParserOptions?: AfxParserOptions,
    eelParserOptions?: EelParserOptions
}

export class ObjectTreeParser {
    protected lexer: Lexer;

    protected contextPathAndFilename: string | undefined;

    protected nodesByType: Map<typeof AbstractNode, AbstractNode[]> = new Map()

    protected ignoredErrors: Error[] = []

    protected options: FusionParserOptions = {
        ignoreErrors: false
    }

    protected constructor(lexer: Lexer, contextPathAndFilename: string | undefined, options?: FusionParserOptions) {
        this.lexer = lexer;
        this.contextPathAndFilename = contextPathAndFilename;
        if (options) this.options = options
    }

    public static parse(sourceCode: string, contextPathAndFilename: string | undefined = undefined, options?: FusionParserOptions) {
        const lexer = new Lexer(sourceCode);
        const parser = new ObjectTreeParser(lexer, contextPathAndFilename, options);
        return parser.parseFusionFile();
    }

    /**
     * Consume the current token.
     * Can only consume if accept was called before.
     *
     * @return Token
     */
    protected consume(): Token {
        return this.lexer.consumeLookahead();
    }

    /**
     * Accepts a token of a given type.
     * The Lexer will look up the regex for the token and try to match it on the current string.
     * First match wins.
     *
     * @param {number} tokenType
     * @return bool
     */
    protected accept(tokenType: number, debug = false): boolean {
        const token = this.lexer.getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType, debug);
        if (token === null) {
            return false;
        }
        return token.getType() === tokenType;
    }

    /**
     * Expects a token of a given type.
     * The Lexer will look up the regex for the token and try to match it on the current string.
     * First match wins.
     *
     * @param {number} tokenType
     * @return Token
     * @throws ParserUnexpectedCharException
     */
    protected expect(tokenType: number): Token {
        const token = this.lexer.getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType);
        if (token === null || token.getType() !== tokenType) {
            throw Error(`Expected token: '${Token.typeToString(tokenType)}'.`)
            // throw new ParserUnexpectedCharException("Expected token: 'tokenReadable'.", 1646988824);
        }
        return this.lexer.consumeLookahead();
    }

    /**
     * Checks, if the token type matches the current, if so consume it and return true.
     * @param {number} tokenType
     * @return bool|null
     */
    protected lazyExpect(tokenType: number): boolean {
        const token = this.lexer.getCachedLookaheadOrTryToGenerateLookaheadForTokenAndGetLookahead(tokenType);
        if (token === null || token.getType() !== tokenType) {
            return false;
        }
        this.lexer.consumeLookahead();
        return true;
    }

    /**
     * OptionalBigGap
     *  = ( NEWLINE / OptionalSmallGap )*
     */
    protected lazyBigGap(): Comment[] {
        const comments = []
        while (true) {
            switch (true) {
                case this.accept(Token.SPACE):
                case this.accept(Token.NEWLINE):
                    this.consume();
                    break;
                case this.accept(Token.SLASH_COMMENT):
                case this.accept(Token.HASH_COMMENT):
                case this.accept(Token.MULTILINE_COMMENT):
                    comments.push(this.parseComment())
                    break;
                default:
                    return comments;
            }
        }
    }

    /**
     * OptionalSmallGap
     *  = ( SPACE / SLASH_COMMENT / HASH_COMMENT / MULTILINE_COMMENT )*
     */
    protected lazySmallGap(): Comment | undefined {
        while (true) {
            switch (true) {
                case this.accept(Token.SPACE):
                    this.consume();
                    break;
                case this.accept(Token.SLASH_COMMENT):
                case this.accept(Token.HASH_COMMENT):
                    return this.parseComment();
                default:
                    return;
            }
        }
    }

    protected parseComment() {
        let type: number | undefined = undefined
        let prefix: string | undefined = undefined
        switch (true) {
            case this.accept(Token.SLASH_COMMENT):
                type = type ?? Token.SLASH_COMMENT
                prefix = prefix ?? "//"

            case this.accept(Token.HASH_COMMENT):
                type = type ?? Token.HASH_COMMENT
                prefix = prefix ?? "#"

            case this.accept(Token.MULTILINE_COMMENT):
                type = type ?? Token.MULTILINE_COMMENT
                prefix = prefix ?? "/*"

                const position = this.createPosition()
                const rawComment = this.consume().getValue();

                position.begin -= rawComment.length
                const comment = new Comment(rawComment.replace(prefix, ""), type === Token.MULTILINE_COMMENT, prefix, this.endPosition(position))
                this.addNodeToNodesByType(comment)
                return comment
            default:
                throw new Error('Expected Comment')
        }
    }

    /**
     * FusionFile
     *  = StatementList
     */
    protected parseFusionFile() {
        // try {
        const file = new FusionFile(this.parseStatementList(null, "file"), this.contextPathAndFilename);
        file.nodesByType = this.flushNodesByType()
        file.errors = this.ignoredErrors
        return file
        // } catch (e) {
        //     throw e;
        // } catch (ParserUnexpectedCharException e) {
        //     throw this.prepareParserException(new ParserException())
        //         .setCode(e.getCode())
        //         .setMessageCreator (MessageLinePart nextLine) use (e) {
        //             return "Unexpected char {nextLine.charPrint()}. {e.getMessage()}";
        //         })
        //         .setPrevious(e)
        //         .build();
        // } catch (Fusion\Exception e) {
        //     throw this.prepareParserException(new ParserException())
        //         .setCode(e.getCode())
        //         .setMessage('Exception while parsing: ' . e.getMessage())
        //         .setHideColumnInformation()
        //         .setPrevious(e)
        //         .build();
        // }
    }

    /**
     * StatementList
     *  = ( Statement )*
     *
     * @param ?int stopLookahead When this tokenType is encountered the loop will be stopped
     */
    protected parseStatementList(stopLookahead: number | null = null, debugName: string = ""): StatementList {
        const statements = [];
        const comments = []
        comments.push(...this.lazyBigGap())

        while (this.accept(Token.EOF) === false && (stopLookahead === null || this.accept(stopLookahead) === false)) {
            let statement
            try {
                statement = this.parseStatement()
                this.addNodeToNodesByType(statement)
                statements.push(statement)
                // TODO: save order of statements and comments
                comments.push(...this.lazyBigGap())
            } catch (e) {
                if (!this.options.ignoreErrors) {
                    throw e
                } else {
                    this.ignoredErrors.push(<Error>e)
                }
                break;
            }

        }
        return new StatementList(statements, comments)
    }

    /**
     * Statement
     *  = IncludeStatement / ObjectStatement
     */
    protected parseStatement(): AbstractStatement {
        // watch out for the order, its regex matching and first one wins.
        switch (true) {
            case this.accept(Token.INCLUDE):
                return this.parseIncludeStatement();
            case this.accept(Token.PROTOTYPE_START):
            case this.accept(Token.OBJECT_PATH_PART):
            case this.accept(Token.META_PATH_START):
            case this.accept(Token.STRING_SINGLE_QUOTED):
            case this.accept(Token.STRING_DOUBLE_QUOTED):
                return this.parseObjectStatement();
        }

        if (!this.options.ignoreErrors) console.log("parseStatement")
        if (!this.options.ignoreErrors) this.lexer.debug()
        throw new ParserError("Error while parsing statement", this.lexer.getCursor())
    }

    /**
     * IncludeStatement
     *  = INCLUDE ( STRING / CHAR / FILE_PATTERN ) EndOfStatement
     */
    protected parseIncludeStatement(): IncludeStatement {
        const position = this.createPosition()
        this.expect(Token.INCLUDE);
        this.lazyExpect(Token.SPACE);
        let filePattern
        switch (true) {
            case this.accept(Token.STRING_DOUBLE_QUOTED):
            case this.accept(Token.STRING_SINGLE_QUOTED):
                const stringWrapped = this.consume().getValue();
                filePattern = stringWrapped.substring(1, stringWrapped.length - 1)
                break;
            case this.accept(Token.FILE_PATTERN):
                filePattern = this.consume().getValue();
                break;
            default:
                throw new Error('Expected file pattern in quotes or [a-zA-Z0-9.*:/_-]')
            // throw new ParserUnexpectedCharException('Expected file pattern in quotes or [a-zA-Z0-9.*:/_-]', 1646988832);
        }

        this.parseEndOfStatement("parseIncludeStatement");

        return new IncludeStatement(filePattern, this.endPosition(position));
    }

    /**
     * ObjectStatement
     *  = ObjectPath ( ValueAssignment / ValueUnset / ValueCopy )? ( Block / EndOfStatement )
     */
    protected parseObjectStatement(): ObjectStatement {
        const position = this.createPosition()
        const currentPath = this.parseObjectPath();

        this.addNodeToNodesByType(currentPath)
        this.lazyExpect(Token.SPACE);
        const cursorAfterObjectPath = this.lexer.getCursor();


        let operation = null
        switch (true) {
            case this.accept(Token.ASSIGNMENT): operation = this.parseValueAssignment(); break;
            case this.accept(Token.UNSET): operation = this.parseValueUnset(); break;
            case this.accept(Token.COPY): operation = this.parseValueCopy(); break;
        }

        if (operation !== null) {
            this.addNodeToNodesByType(operation)
        }

        this.lazyExpect(Token.SPACE);

        if (this.accept(Token.LBRACE)) {
            const block = this.parseBlock();

            return new ObjectStatement(currentPath, operation, block, cursorAfterObjectPath, this.endPosition(position));
        }
        if (operation === null) {
            if (this.options.ignoreErrors) {
                const newPosition = {
                    begin: this.lexer.getCursor(),
                    end: this.lexer.getCursor()
                }
                operation = new ValueAssignment(new NullValue(NodePositionStub), newPosition)
            } else {
                throw Error("operation is null")
            }
        }
        if (!(operation instanceof ValueAssignment && operation.pathValue instanceof EelExpressionValue)) {
            this.parseEndOfStatement("parseObjectStatement");
        }

        return new ObjectStatement(currentPath, operation, undefined, cursorAfterObjectPath, this.endPosition(position));
    }

    /**
     * ObjectPath
     *  = PathSegment ( '.' PathSegment )*
     *
     */
    protected parseObjectPath(): ObjectPath {
        const position = this.createPosition()
        const segments = [];
        do {
            const segment = this.parsePathSegment()
            this.addNodeToNodesByType(segment)
            segments.push(segment);
        } while (this.lazyExpect(Token.DOT));
        const objectPath = new ObjectPath(...segments);
        objectPath.setPosition(this.endPosition(position))
        return objectPath
    }

    /**
     * PathSegment
     *  = ( PROTOTYPE_START FUSION_OBJECT_NAME ')' / OBJECT_PATH_PART / '@' OBJECT_PATH_PART / STRING / CHAR )
     */
    protected parsePathSegment(): AbstractPathSegment {
        let position = this.createPosition()
        switch (true) {
            case this.accept(Token.PROTOTYPE_START):
                this.consume();
                position = this.createPosition()
                let prototypeName
                try {
                    prototypeName = this.expect(Token.FUSION_OBJECT_NAME).getValue();
                } catch (error) {
                    throw error
                    // throw this.prepareParserException(new ParserException())
                    //     .setCode(1646991578)
                    //     .setMessageCreator([MessageCreator.class, 'forPathSegmentPrototypeName'])
                    //     .build();
                }
                position = this.endPosition(position)
                this.expect(Token.RPAREN);
                return new PrototypePathSegment(prototypeName, position);

            case this.accept(Token.OBJECT_PATH_PART):
                const pathKey = this.consume().getValue();
                position = this.createPosition()
                position.begin -= pathKey.length
                return new PathSegment(pathKey, this.endPosition(position));

            case this.accept(Token.META_PATH_START):
                const nodePosition = this.createPosition()
                this.consume();
                const metaPathSegmentKey = this.expect(Token.OBJECT_PATH_PART).getValue();
                return new MetaPathSegment(metaPathSegmentKey, this.endPosition(nodePosition));

            case this.accept(Token.STRING_DOUBLE_QUOTED):
            case this.accept(Token.STRING_SINGLE_QUOTED):
                const stringWrapped = this.consume().getValue();
                const quotedPathKey = stringWrapped.substring(1, stringWrapped.length - 1);
                position.begin -= quotedPathKey.length
                return new PathSegment(quotedPathKey, this.endPosition(position));
            case this.accept(Token.SPACE):
            case this.accept(Token.NEWLINE):
                if (this.options.ignoreErrors) return new IncompletePathSegment(this.endPosition(this.createPosition()));
        }

        throw Error("Could not parse segment")
        // throw this.prepareParserException(new ParserException())
        //     .setCode(1635708755)
        //     .setMessageCreator([MessageCreator.class, 'forParsePathSegment'])
        //     .build();
    }

    /**
     * ValueAssignment
     *  = ASSIGNMENT PathValue
     */
    protected parseValueAssignment(): ValueAssignment {
        const position = this.createPosition()
        this.expect(Token.ASSIGNMENT);
        this.lazyExpect(Token.SPACE);
        const value = this.parsePathValue();
        this.addNodeToNodesByType(value)
        return new ValueAssignment(value, this.endPosition(position));
    }

    /**
     * PathValue
     *  = ( CHAR / STRING / DSL_EXPRESSION / FusionObject / EelExpression )
     */
    protected parsePathValue(): AbstractPathValue {
        // watch out for the order, its regex matching and first one wins.
        // sorted by likelyhood
        const position = this.createPosition()
        let stringContent
        switch (true) {
            case this.accept(Token.STRING_SINGLE_QUOTED):
                const charWrapped = this.consume().getValue();
                stringContent = charWrapped.substring(1, charWrapped.length - 1);
                return new StringValue(stripslashes(stringContent), this.endPosition(position));

            case this.accept(Token.STRING_DOUBLE_QUOTED):
                const stringWrapped = this.consume().getValue();
                stringContent = stringWrapped.substring(1, stringWrapped.length - 1);
                return new StringValue(stripcslashes(stringContent), this.endPosition(position));

            case this.accept(Token.DSL_EXPRESSION_START):
                return this.parseDslExpression();

            case this.accept(Token.FLOAT):
                return new FloatValue(parseFloat(this.consume().getValue()));

            case this.accept(Token.INTEGER):
                return new IntValue(parseInt(this.consume().getValue()));

            case this.accept(Token.TRUE_VALUE):
                this.consume();
                return new BoolValue(true);

            case this.accept(Token.FALSE_VALUE):
                this.consume();
                return new BoolValue(false);

            case this.accept(Token.NULL_VALUE):
                this.consume();
                return new NullValue(NodePositionStub);

            case this.accept(Token.FUSION_OBJECT_NAME):
                const nodePosition = this.createPosition()
                const value = this.consume().getValue()
                nodePosition.begin -= value.length
                return new FusionObjectValue(value, this.endPosition(nodePosition));

            case this.accept(Token.EEL_EXPRESSION_START):
                const eelExpressionValue = new EelExpressionValue();
                this.consume()
                const eelPosition = this.createPosition()
                const eelLexer = new EelLexer(this.lexer.getRemainingCode())
                const eelParser = new EelParser(eelLexer, this.lexer.getCursor(), this.options.eelParserOptions)
                const eelNodes = eelParser.parse()

                eelNodes["parent"] = <any>eelExpressionValue

                for (const [type, nodes] of eelParser.nodesByType.entries()) {
                    const list = this.nodesByType.get(<any>type) ?? []
                    for (const node of nodes) {
                        list.push(<any>node)
                    }
                    this.nodesByType.set(<any>type, list)
                }
                eelExpressionValue.nodes = eelNodes
                this.lexer.advanceCursor(eelLexer.getCursor() + 1)
                eelExpressionValue["position"] = this.endPosition(eelPosition)
                eelExpressionValue.value = this.lexer.getCode().slice(eelPosition.begin, eelPosition.end - 1) // -1 for `}`
                return eelExpressionValue


        }

        if (!this.options.ignoreErrors) console.log("parsePathValue")
        if (!this.options.ignoreErrors) this.lexer.debug()

        throw new ParserError("Could not parse value", this.lexer.getCursor())
        // throw this.prepareParserException(new ParserException())
        //     .setCode(1646988841)
        //     .setMessageCreator([MessageCreator.class, 'forParsePathValue'])
        //     .build();
    }

    /**
     * DslExpression
     *  = DSL_EXPRESSION_START DSL_EXPRESSION_CONTENT
     */
    protected parseDslExpression(): DslExpressionValue {
        const dslIdentifier = this.expect(Token.DSL_EXPRESSION_START).getValue();
        const position = this.createPosition()
        position.begin -= dslIdentifier.length
        let dslCode = ''
        try {
            dslCode = this.expect(Token.DSL_EXPRESSION_CONTENT).getValue();
        } catch (error) {
            if (this.options.ignoreErrors) {
                this.ignoredErrors.push(<Error>error)
            } else {
                throw error
            }
        }
        dslCode = dslCode.substring(1, dslCode.length - 1);
        const dslExpression = new DslExpressionValue(dslIdentifier, dslCode, this.endPosition(position), this.options.afxParserOptions);
        const nodesByType = dslExpression.parse()

        for (const [type, nodes] of nodesByType.entries()) {
            const list = this.nodesByType.get(<any>type) ?? []
            for (const node of nodes) {
                list.push(<any>node)
            }
            this.nodesByType.set(<any>type, list)
        }
        return dslExpression
    }

    /**
     * ValueUnset
     *  = UNSET
     */
    protected parseValueUnset(): ValueUnset {
        this.expect(Token.UNSET);
        return new ValueUnset(NodePositionStub);
    }

    /**
     * ValueCopy
     *  = COPY ObjectPathAssignment
     */
    protected parseValueCopy(): ValueCopy {
        this.expect(Token.COPY);
        this.lazyExpect(Token.SPACE);
        const sourcePath = this.parseAssignedObjectPath();
        return new ValueCopy(sourcePath);
    }

    /**
     * AssignedObjectPath
     *  = '.'? ObjectPath
     */
    protected parseAssignedObjectPath(): AssignedObjectPath {
        const isRelative = this.lazyExpect(Token.DOT);
        return new AssignedObjectPath(this.parseObjectPath(), Boolean(isRelative));
    }

    /**
     * Block:
     *  = '{' StatementList? '}'
     */
    protected parseBlock(debugName: string = ""): Block {
        this.expect(Token.LBRACE);
        const cursorPositionStartOfBlock = this.lexer.getCursor() - 1;
        this.parseEndOfStatement("parseBlock");

        const statementList = this.parseStatementList(Token.RBRACE, debugName);

        try {
            this.expect(Token.RBRACE);
        } catch (error) {
            if (this.options.ignoreErrors) {
                this.ignoredErrors.push(<Error>error)
            } else {
                throw error
            }
        }

        return new Block(statementList);
    }

    /**
     * EndOfStatement
     *  = ( EOF / NEWLINE )
     */
    protected parseEndOfStatement(debugFrom: string = ''): void {
        this.lazySmallGap();

        if (this.accept(Token.EOF)) {
            return;
        }
        if (this.accept(Token.NEWLINE)) {
            this.consume();
            return;
        }

        if (!this.options.ignoreErrors) console.log("parseEndOfStatement")
        if (!this.options.ignoreErrors) this.lexer.debug()
        throw Error("parsed EOF from: " + debugFrom)
        // throw this.prepareParserException(new ParserException())
        //     .setCode(1635878683)
        //     .setMessageCreator([MessageCreator.class, 'forParseEndOfStatement'])
        //     .build();
    }

    protected createPosition() {
        return new NodePosition(this.lexer.getCursor())
    }

    protected endPosition(position: NodePosition): NodePosition {
        position.end = this.lexer.getCursor()
        return position
    }

    protected addNodeToNodesByType(node: AbstractNode) {
        const type = <typeof AbstractNode>node.constructor
        const list = this.nodesByType.get(type) ?? []
        list.push(node)
        this.nodesByType.set(type, list)
    }

    protected flushNodesByType() {
        const map = new Map(this.nodesByType)
        this.nodesByType.clear()
        return map
    }


    // protected prepareParserException(ParserException parserException): ParserException
    // {
    //     return parserException
    //         .setFile(this.contextPathAndFilename)
    //         .setFusion(this.lexer.getCode())
    //         .setCursor(this.lexer.getCursor());
    // }
}