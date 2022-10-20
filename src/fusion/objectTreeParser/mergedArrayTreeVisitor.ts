import { count } from "console";
import path from "path";
import { Block } from "./ast/Block";
import { AssignedObjectPath } from "./ast/AssignedObjectPath";
import { BoolValue } from "./ast/BoolValue";
import { CharValue } from "./ast/CharValue";
import { DslExpressionValue } from "./ast/DslExpressionValue";
import { EelExpressionValue } from "./ast/EelExpressionValue";
import { FloatValue } from "./ast/FloatValue";
import { FusionFile } from "./ast/FusionFile";
import { FusionObjectValue } from "./ast/FusionObjectValue";
import { IncludeStatement } from "./ast/IncludeStatement";
import { IntValue } from "./ast/IntValue";
import { MetaPathSegment } from "./ast/MetaPathSegment";
import { NullValue } from "./ast/NullValue";
import { ObjectPath } from "./ast/ObjectPath";
import { ObjectStatement } from "./ast/ObjectStatement";
import { PathSegment } from "./ast/PathSegment";
import { PrototypePathSegment } from "./ast/PrototypePathSegment";
import { SimpleValue } from "./ast/SimpleValue";
import { StatementList } from "./ast/StatementList";
import { StringValue } from "./ast/StringValue";
import { ValueCopy } from "./ast/ValueCopy";
import { ValueUnset } from "./ast/ValueUnset";
import { AstNodeVisitorInterface } from "./astNodeVisitorInterface";
import { MergedArrayTree } from "./mergedArrayTree";
import { Parser } from "../parser";
import { ValueAssignment } from "./ast/ValueAssignment";

export type FileIncludeHandler = (mergedArrayTree: MergedArrayTree, filePattern: string, contextPathAndFilename: string|undefined) => any
export type DslTranspileHandler = (identifier: string, code: string) => any
/**
 * Builds the merged array tree for the Fusion runtime
 */
export class MergedArrayTreeVisitor implements AstNodeVisitorInterface
{
    /**
     * For nested blocks to determine the prefix
     */
    protected currentObjectPathStack: any[] = [];

    protected contextPathAndFilename: string|undefined;

    protected currentObjectStatementCursor: number = -1;

    protected  mergedArrayTree: MergedArrayTree
    protected handleFileInclude: FileIncludeHandler
    protected handleDslTranspile: DslTranspileHandler

    public constructor(mergedArrayTree: MergedArrayTree, handleFileInclude: FileIncludeHandler, handleDslTranspile: DslTranspileHandler) {
        this.mergedArrayTree = mergedArrayTree
        this.handleFileInclude = handleFileInclude
        this.handleDslTranspile = handleDslTranspile
    }

    public visitFusionFile( fusionFile: FusionFile): MergedArrayTree
    {
        this.contextPathAndFilename = fusionFile.contextPathAndFileName;
        fusionFile.statementList.visit(this);
        return this.mergedArrayTree;
    }

    public visitStatementList( statementList: StatementList)
    {
        for(const statement of statementList.statements) {
            statement.visit(this);
        }
    }

    public visitIncludeStatement( includeStatement: IncludeStatement)
    {
        (this.handleFileInclude)(this.mergedArrayTree, includeStatement.filePattern, this.contextPathAndFilename);
    }

    public visitObjectStatement( objectStatement: ObjectStatement)
    {
        this.currentObjectStatementCursor = objectStatement.cursor;

        const currentObjectPathPrefix = this.getCurrentObjectPathPrefix()
        // console.log("currentObjectPathPrefix", currentObjectPathPrefix)
        const currentPath = objectStatement.path.visit(this, currentObjectPathPrefix);
        // console.log("#### currentPath", currentPath)
        objectStatement.operation?.visit(this, currentPath);
        objectStatement.block?.visit(this, currentPath);
    }

    public visitBlock( block: Block,  currentPath: any[]|null = null)
    {
        if(!currentPath) {
            throw new Error("currentPath is required")
            // throw new \BadMethodCallException('currentPath is required.');
        }

        this.currentObjectPathStack.push(currentPath)

        block.statementList.visit(this);

        this.currentObjectPathStack.pop()
    }

    public visitObjectPath( objectPath: ObjectPath, objectPathPrefix: any[]): any[]
    {
        let path = objectPathPrefix;
        for(const segment of objectPath.segments) {
            const visitedSegmentReturn = segment.visit(this)
            // console.log("---> visitedSegmentReturn", objectPathPrefix, visitedSegmentReturn)
            path = [...path, ...visitedSegmentReturn].filter(Boolean);

            // if(visitedSegmentReturn[0] === '__prototypes') {
            //     console.log("path is ", path)
            //     console.trace()
            //     process.exit()
            // }
        }
        // console.log("visited object path ", path)
        // console.log("\\___with segments", objectPath.segments)
        return path;
    }

    public visitMetaPathSegment( metaPathSegment: MetaPathSegment): any[]
    {
        return ['__meta', metaPathSegment.identifier];
    }

    public visitPrototypePathSegment( prototypePathSegment: PrototypePathSegment): any[]
    {
        return ['__prototypes', prototypePathSegment.identifier];
    }

    public visitPathSegment( pathSegment: PathSegment): any[]
    {
        const key = pathSegment.identifier.replace(/\\(.)/mg, "$1");
        this.validateParseTreeKey(key);
        return [key];
    }

    public visitValueAssignment( valueAssignment: ValueAssignment, currentPath: string[])
    {
        if(!currentPath) {
            throw new Error("currentPath is required")
            // throw new \BadMethodCallException('currentPath is required.');
        }

        const value = valueAssignment.pathValue.visit(this);
        this.mergedArrayTree.setValueInTree(currentPath, value);
    }

    public visitFusionObjectValue( fusionObjectValue: FusionObjectValue)
    {
        return {
            '__objectType': fusionObjectValue.value, '__value': null, '__eelExpression': null
        };
    }

    public visitDslExpressionValue( dslExpressionValue: DslExpressionValue)
    {
        return (this.handleDslTranspile)(dslExpressionValue.identifier, dslExpressionValue.code);
        // try {
        // } catch (ParserException e) {
        //     throw e;
        // } catch (\Exception e) {
        //     // convert all exceptions from dsl transpilation to fusion exception and add file and line info
        //     throw this.prepareParserException(new ParserException())
        //         .setCode(1180600696)
        //         .setMessage(e.getMessage())
        //         .build();
        // }
    }

    public visitEelExpressionValue( eelExpressionValue: EelExpressionValue)
    {
        const eelWithoutNewLines = eelExpressionValue.value.replace("\n", "")
        return {
            '__eelExpression': eelWithoutNewLines, '__value': null, '__objectType': null
        };
    }

    public visitFloatValue( floatValue: FloatValue)
    {
        return floatValue.value;
    }

    public visitIntValue( intValue: IntValue)
    {
        return intValue.value;
    }

    public visitBoolValue( boolValue: BoolValue)
    {
        return boolValue.value;
    }

    public visitNullValue( nullValue: NullValue)
    {
        return null;
    }

    public visitStringValue( stringValue: StringValue): string
    {
        return stringValue.value;
    }

    public visitCharValue(charValue: CharValue): string {
        return charValue.value
    }

    public visitSimpleValue(simpleValue: SimpleValue, ...args: any[]): any {
        return simpleValue.value
    }

    public visitValueCopy( valueCopy: ValueCopy,  currentPath: any[] = [])
    {
        if(!currentPath) {
            throw new Error("currentPath is required")
            // throw new \BadMethodCallException('currentPath is required.');
        }
        const sourcePath = valueCopy.assignedObjectPath.visit(this, MergedArrayTree.getParentPath(currentPath));

        console.log("visit value copy ")


        const currentPathsPrototype = MergedArrayTree.pathIsPrototype(currentPath);
        const sourcePathIsPrototype = MergedArrayTree.pathIsPrototype(sourcePath);
        if (currentPathsPrototype && sourcePathIsPrototype) {
            // both are a prototype definition
            if (currentPath.length !== 2 || sourcePath.length !== 2) {
                // one of the path has not a length of 2: this means
                // at least one path is nested (f.e. foo.prototype(Bar))
                // Currently, it is not supported to override the prototypical inheritance in
                // parts of the Fusion rendering tree.
                // Although this might work conceptually, it makes reasoning about the prototypical
                // inheritance tree a lot more complex; that's why we forbid it right away.
                throw new Error('Cannot inherit, when one of the sides is nested (e.g. foo.prototype(Bar)). Setting up prototype inheritance is only supported at the top level: prototype(Foo) < prototype(Bar)')
                // throw this.prepareParserException(new ParserException())
                //     .setCode(1358418019)
                //     .setMessage('Cannot inherit, when one of the sides is nested (e.g. foo.prototype(Bar)). Setting up prototype inheritance is only supported at the top level: prototype(Foo) < prototype(Bar)')
                //     .build();
            }
            // it must be of the form "prototype(Foo) < prototype(Bar)"
            currentPath.push('__prototypeObjectName')
            this.mergedArrayTree.setValueInTree(currentPath, sourcePath[sourcePath.length-1]);
            return;
        }

        // $currentPathsPrototype xor $sourcePathIsPrototype
        if (currentPathsPrototype != sourcePathIsPrototype) {

            console.log(currentPathsPrototype)
            console.log(sourcePathIsPrototype)


            // Only one of "source" or "target" is a prototype. We do not support copying a
            // non-prototype value to a prototype value or vice-versa.
            throw new Error("Cannot inherit, when one of the sides is no prototype definition of the form prototype(Foo). It is only allowed to build inheritance chains with prototype objects.")
            // throw this.prepareParserException(new ParserException())
            //     .setCode(1358418015)
            //     .setMessage("Cannot inherit, when one of the sides is no prototype definition of the form prototype(Foo). It is only allowed to build inheritance chains with prototype objects.")
            //     .build();
        }

        this.mergedArrayTree.copyValueInTree(currentPath, sourcePath);
    }

    public visitAssignedObjectPath( assignedObjectPath: AssignedObjectPath, relativePath = []): any
    {
        let path: string[] = [];
        if (assignedObjectPath.isRelative) {
            path = relativePath;
        }
        return assignedObjectPath.objectPath.visit(this, path);
    }

    public visitValueUnset( valueUnset: ValueUnset,  currentPath: any[] = [])
    {
        if(!currentPath) {
            throw new Error("currentPath is required")
            // throw new \BadMethodCallException('currentPath is required.');
        }

        this.mergedArrayTree.removeValueInTree(currentPath);
    }

    protected getCurrentObjectPathPrefix(): any[]
    {
        const lastElementOfStack = this.currentObjectPathStack[this.currentObjectPathStack.length-1];
        return (lastElementOfStack === undefined) ? [] : lastElementOfStack;
    }

    protected validateParseTreeKey( pathKey: string)
    {
        if (pathKey === '') {
            throw new Error("A path must not be empty.")
            // throw this.prepareParserException(new ParserException())
            //     .setCode(1646988838)
            //     .setMessage("A path must not be empty.")
            //     .build();
        }
        if (pathKey.startsWith('__') && Parser.reservedParseTreeKeys.includes(pathKey)) {
            throw new Error("Reversed key '"+pathKey+"' used.")
            // throw this.prepareParserException(new ParserException())
            //     .setCode(1437065270)
            //     .setMessage("Reversed key 'pathKey' used.")
            //     .build();
        }
        if (pathKey.includes("\n")) {
            const cleaned = pathKey.replace("\n", "")
            throw new Error("Key '"+cleaned+"' cannot contain newlines.")
            // throw this.prepareParserException(new ParserException())
            //     .setCode(1644068086)
            //     .setMessage("Key 'cleaned' cannot contain newlines.")
            //     .build();
        }
    }

    // protected prepareParserException( parserException: ParserException): ParserException
    // {
    //     if (this.contextPathAndFilename === null) {
    //         fusionCode = '';
    //     } else {
    //         fusionCode = file_get_contents(this.contextPathAndFilename);
    //     }
    //     return parserException
    //         .setHideColumnInformation()
    //         .setFile(this.contextPathAndFilename)
    //         .setFusion(fusionCode)
    //         .setCursor(this.currentObjectStatementCursor);
    // }
}
