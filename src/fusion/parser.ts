import { AbstractNode } from '../common/AbstractNode';
import { Comment } from '../common/Comment';
import { NodePosition } from '../common/NodePosition';
import { ParserError } from '../common/ParserError';
import { AfxParserOptions } from '../dsl/afx/parser';
import { Lexer as EelLexer } from '../dsl/eel/lexer';
import { Parser as EelParser, EelParserOptions } from '../dsl/eel/parser';
import { Lexer } from './lexer';
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
import { IncompletePathSegment } from './nodes/IncompletePathSegment';
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
import { Token } from './token';


const stripSlashes = (str: string) => str.replace(/\\./g, (match) => (new Function(`return "${match}"`))() || match)
const stripCClashes = stripSlashes // TODO: stripCClashes = stripSlashes = uff

export interface FusionParserOptions {
    ignoreErrors: boolean
    afxParserOptions?: AfxParserOptions,
    eelParserOptions?: EelParserOptions
}

export class ObjectTreeParser {
    protected nodesByType: Map<typeof AbstractNode, AbstractNode[]> = new Map()
    protected ignoredErrors: Error[] = []
    protected options: FusionParserOptions = {
        ignoreErrors: false
    }

    protected constructor(protected lexer: Lexer, protected contextPathAndFilename: string | undefined, options?: FusionParserOptions) {
        this.lexer = lexer;
        this.contextPathAndFilename = contextPathAndFilename;
        if (options) this.options = options
    }

    public static parse(sourceCode: string, contextPathAndFilename: string | undefined = undefined, options?: FusionParserOptions) {
        const lexer = new Lexer(sourceCode);
        const parser = new ObjectTreeParser(lexer, contextPathAndFilename, options);
        return parser.parseFusionFile();
    }

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
            // // throw new ParserUnexpectedCharException("Expected token: 'tokenReadable'.", 1646988824);
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

        if (this.accept(Token.SLASH_COMMENT)) {
            type = Token.SLASH_COMMENT
            prefix = "//"
        } else if (this.accept(Token.HASH_COMMENT)) {
            type = Token.HASH_COMMENT
            prefix = "#"
        } else if (this.accept(Token.MULTILINE_COMMENT)) {
            type = Token.MULTILINE_COMMENT
            prefix = "/*"
        } else throw new Error('Expected Comment')

        const position = this.createPosition()
        const rawComment = this.consume().getValue();

        position.begin -= rawComment.length
        const comment = new Comment(rawComment.replace(prefix, ""), type === Token.MULTILINE_COMMENT, prefix, this.endPosition(position))
        this.addNodeToNodesByType(comment)
        return comment
    }

    protected parseFusionFile() {
        // try {
        const file = new FusionFile(this.parseStatementList(<FusionFile><unknown>null, null, "file"), this.contextPathAndFilename);
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
    protected parseStatementList(parent: AbstractNode, stopLookahead: number | null = null, debugName: string = ""): StatementList {
        const position = this.createPosition()
        const statements = [];
        const comments = []
        comments.push(...this.lazyBigGap())

        while (this.accept(Token.EOF) === false && (stopLookahead === null || this.accept(stopLookahead) === false)) {
            let statement
            try {
                statement = this.parseStatement(<StatementList><unknown>null)
                this.addNodeToNodesByType(statement)
                statements.push(statement)
                // TODO: save order of statements and comments => check again why this is needed
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
        // TODO: positioning of StatementList begins to late
        const statementList = new StatementList(statements, comments, this.endPosition(position), parent)
        this.addNodeToNodesByType(statementList)
        return statementList
    }

    /**
     * Statement
     *  = IncludeStatement / ObjectStatement
     */
    protected parseStatement(parent: AbstractNode): AbstractStatement {
        // watch out for the order, its regex matching and first one wins.

        if (this.accept(Token.INCLUDE))
            return this.parseIncludeStatement(parent);

        if (this.accept(Token.PROTOTYPE_START))
            return this.parseObjectStatement(parent);

        if (this.accept(Token.OBJECT_PATH_PART)) {
            this.lexer.advanceCursor(-1 * this.lexer.consumeLookahead().getValue().length)
            return this.parseObjectStatement(parent);
        }

        if (this.accept(Token.META_PATH_START)
            || this.accept(Token.STRING_SINGLE_QUOTED)
            || this.accept(Token.STRING_DOUBLE_QUOTED)
        ) {
            return this.parseObjectStatement(parent);
        }

        if (!this.options.ignoreErrors) console.log("parseStatement")
        if (!this.options.ignoreErrors) this.lexer.debug()
        throw new ParserError("Error while parsing statement", this.lexer.getCursor())
    }

    /**
     * IncludeStatement
     *  = INCLUDE ( STRING / CHAR / FILE_PATTERN ) EndOfStatement
     */
    protected parseIncludeStatement(parent: AbstractNode): IncludeStatement {
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
            // // throw new ParserUnexpectedCharException('Expected file pattern in quotes or [a-zA-Z0-9.*:/_-]', 1646988832);
        }

        this.parseEndOfStatement("parseIncludeStatement");

        return new IncludeStatement(filePattern, this.endPosition(position), parent);
    }

    /**
     * ObjectStatement
     *  = ObjectPath ( ValueAssignment / ValueUnset / ValueCopy )? ( Block / EndOfStatement )
     */
    protected parseObjectStatement(parent: AbstractNode): ObjectStatement {
        const position = this.createPosition()
        const currentPath = this.parseObjectPath(<ObjectStatement><unknown>null);

        this.addNodeToNodesByType(currentPath)
        this.lazyExpect(Token.SPACE);
        const cursorAfterObjectPath = this.lexer.getCursor();


        let operation = null
        switch (true) {
            case this.accept(Token.ASSIGNMENT): operation = this.parseValueAssignment(<ObjectStatement><unknown>null); break;
            case this.accept(Token.UNSET): operation = this.parseValueUnset(<ObjectStatement><unknown>null); break;
            case this.accept(Token.COPY): operation = this.parseValueCopy(<ObjectStatement><unknown>null); break;
        }

        if (operation !== null) {
            this.addNodeToNodesByType(operation)
        }

        this.lazyExpect(Token.SPACE);

        if (this.accept(Token.LBRACE)) {
            const block = this.parseBlock(<ObjectStatement><unknown>null);

            return new ObjectStatement(currentPath, operation, block, cursorAfterObjectPath, this.endPosition(position), parent);
        }
        if (operation === null) {
            if (this.options.ignoreErrors) {
                const newPosition = {
                    begin: this.lexer.getCursor(),
                    end: this.lexer.getCursor()
                }
                // TODO: do not reuse "newPosition" 
                operation = new ValueAssignment(new NullValue(newPosition), newPosition, <ObjectStatement><unknown>null)
            } else {
                throw Error("operation is null")
            }
        }
        if (!(operation instanceof ValueAssignment && operation.pathValue instanceof EelExpressionValue)) {
            this.parseEndOfStatement("parseObjectStatement");
        }

        return new ObjectStatement(currentPath, operation, undefined, cursorAfterObjectPath, this.endPosition(position), parent);
    }

    /**
     * ObjectPath
     *  = PathSegment ( '.' PathSegment )*
     *
     */
    protected parseObjectPath(parent: AbstractNode): ObjectPath {
        const position = this.createPosition()
        const segments = [];
        do {
            const segment = this.parsePathSegment()
            this.addNodeToNodesByType(segment)
            segments.push(segment);
        } while (this.lazyExpect(Token.DOT));
        return new ObjectPath(this.endPosition(position), parent, ...segments);
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
                    // // throw this.prepareParserException(new ParserException())
                    // //      .setCode(1646991578)
                    // //     .setMessageCreator([MessageCreator.class, 'forPathSegmentPrototypeName'])
                    // //     .build();
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
                if (this.options.ignoreErrors) return new IncompletePathSegment("", this.endPosition(this.createPosition()));
        }

        throw Error("Could not parse segment")
        // // throw this.prepareParserException(new ParserException())
        // //     .setCode(1635708755)
        // //     .setMessageCreator([MessageCreator.class, 'forParsePathSegment'])
        // //     .build();
    }

    protected parseValueAssignment(parent: AbstractNode): ValueAssignment {
        const position = this.createPosition()
        this.expect(Token.ASSIGNMENT);
        this.lazyExpect(Token.SPACE);
        const value = this.parsePathValue();
        this.addNodeToNodesByType(value)
        return new ValueAssignment(value, this.endPosition(position), parent);
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
                return new StringValue(stripSlashes(stringContent), this.endPosition(position));

            case this.accept(Token.STRING_DOUBLE_QUOTED):
                const stringWrapped = this.consume().getValue();
                stringContent = stringWrapped.substring(1, stringWrapped.length - 1);
                return new StringValue(stripCClashes(stringContent), this.endPosition(position));

            case this.accept(Token.DSL_EXPRESSION_START):
                return this.parseDslExpression();

            case this.accept(Token.FLOAT):
                return new FloatValue(parseFloat(this.consume().getValue()), this.endPosition(position));

            case this.accept(Token.INTEGER):
                return new IntValue(parseInt(this.consume().getValue()), this.endPosition(position));

            case this.accept(Token.TRUE_VALUE):
                this.consume();
                return new BoolValue(true, this.endPosition(position));

            case this.accept(Token.FALSE_VALUE):
                this.consume();
                return new BoolValue(false, this.endPosition(position));

            case this.accept(Token.NULL_VALUE):
                this.consume();
                return new NullValue(this.endPosition(position));

            case this.accept(Token.FUSION_OBJECT_NAME):
                const nodePosition = this.createPosition()
                const value = this.consume().getValue()
                nodePosition.begin -= value.length
                return new FusionObjectValue(value, this.endPosition(nodePosition));

            case this.accept(Token.EEL_EXPRESSION_START):
                this.consume()
                const eelPosition = this.createPosition()
                const eelLexer = new EelLexer(this.lexer.getRemainingCode())
                const eelParser = new EelParser(eelLexer, this.lexer.getCursor(), this.options.eelParserOptions)
                const eelNodes = eelParser.parse()

                for (const [type, nodes] of eelParser.nodesByType.entries()) {
                    const list = this.nodesByType.get(<any>type) ?? []
                    for (const node of nodes) {
                        list.push(<any>node)
                    }
                    this.nodesByType.set(<any>type, list)
                }


                this.lexer.advanceCursor(eelLexer.getCursor() + 1)
                const code = this.lexer.getCode().slice(eelPosition.begin, eelPosition.end - 1)
                return new EelExpressionValue(code, this.endPosition(eelPosition), eelNodes);
        }

        if (!this.options.ignoreErrors) console.log("parsePathValue")
        if (!this.options.ignoreErrors) this.lexer.debug()

        throw new ParserError("Could not parse value", this.lexer.getCursor())
        // // throw this.prepareParserException(new ParserException())
        // //     .setCode(1646988841)
        // //     .setMessageCreator([MessageCreator.class, 'forParsePathValue'])
        // //     .build();
    }

    protected parseDslExpression(): DslExpressionValue {
        const dslIdentifier = this.expect(Token.DSL_EXPRESSION_START).getValue();
        const position = this.createPosition()
        position.begin -= dslIdentifier.length
        let dslCode = ''
        try {
            dslCode = this.expect(Token.DSL_EXPRESSION_CONTENT).getValue();
        } catch (error) {
            if (this.options.ignoreErrors) this.ignoredErrors.push(<Error>error)
            else throw error
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

    protected parseValueUnset(parent: AbstractNode): ValueUnset {
        const position = this.createPosition()
        this.expect(Token.UNSET);
        return new ValueUnset(this.endPosition(position), parent);
    }

    protected parseValueCopy(parent: AbstractNode): ValueCopy {
        const position = this.createPosition()
        this.expect(Token.COPY);
        this.lazyExpect(Token.SPACE);
        const sourcePath = this.parseAssignedObjectPath(<ValueCopy><unknown>null);
        return new ValueCopy(sourcePath, this.endPosition(position), parent);
    }

    protected parseAssignedObjectPath(parent: AbstractNode): AssignedObjectPath {
        const position = this.createPosition()
        const isRelative = this.lazyExpect(Token.DOT);
        return new AssignedObjectPath(this.endPosition(position), parent, this.parseObjectPath(<AssignedObjectPath><unknown>null), Boolean(isRelative));
    }

    /**
     * Block:
     *  = '{' StatementList? '}'
     */
    protected parseBlock(parent: AbstractNode, debugName: string = ""): Block {
        this.expect(Token.LBRACE);
        const blockPosition = this.createPosition()
        blockPosition.begin -= 1

        this.parseEndOfStatement("parseBlock");

        const statementList = this.parseStatementList(<Block><unknown>null, Token.RBRACE, debugName);

        try {
            this.expect(Token.RBRACE);
        } catch (error) {
            if (this.options.ignoreErrors) {
                this.ignoredErrors.push(<Error>error)
            } else {
                throw error
            }
        }

        const block = new Block(parent, statementList, this.endPosition(blockPosition))
        this.addNodeToNodesByType(block)
        return block
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
        // //  throw this.prepareParserException(new ParserException())
        // //     .setCode(1635878683)
        // //     .setMessageCreator([MessageCreator.class, 'forParseEndOfStatement'])
        // //     .build();
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