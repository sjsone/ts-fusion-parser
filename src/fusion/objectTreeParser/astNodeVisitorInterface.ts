import { AssignedObjectPath } from "./ast/AssignedObjectPath"
import { Block } from "./ast/Block"
import { BoolValue } from "./ast/BoolValue"
import { CharValue } from "./ast/CharValue"
import { DslExpressionValue } from "./ast/DslExpressionValue"
import { EelExpressionValue } from "./ast/EelExpressionValue"
import { FloatValue } from "./ast/FloatValue"
import { FusionFile } from "./ast/FusionFile"
import { FusionObjectValue } from "./ast/FusionObjectValue"
import { IncludeStatement } from "./ast/IncludeStatement"
import { IntValue } from "./ast/IntValue"
import { MetaPathSegment } from "./ast/MetaPathSegment"
import { NullValue } from "./ast/NullValue"
import { ObjectPath } from "./ast/ObjectPath"
import { ObjectStatement } from "./ast/ObjectStatement"
import { PathSegment } from "./ast/PathSegment"
import { PrototypePathSegment } from "./ast/PrototypePathSegment"
import { SimpleValue } from "./ast/SimpleValue"
import { StatementList } from "./ast/StatementList"
import { StringValue } from "./ast/StringValue"
import { ValueAssignment } from "./ast/ValueAssignment"
import { ValueCopy } from "./ast/ValueCopy"
import { ValueUnset } from "./ast/ValueUnset"

export interface AstNodeVisitorInterface
{
    visitFusionFile( fusionFile: FusionFile): any
    visitStatementList( statementList: StatementList): any
    visitIncludeStatement( includeStatement: IncludeStatement): any
    visitObjectStatement( objectStatement: ObjectStatement, ...args: any[]): any
    visitBlock( block: Block, currentPath: any[]|null): any
    visitObjectPath( objectPath: ObjectPath, ...args: any[]): any
    visitMetaPathSegment( metaPathSegment: MetaPathSegment): any
    visitPrototypePathSegment( prototypePathSegment: PrototypePathSegment): any
    visitPathSegment( pathSegment: PathSegment): any
    visitValueAssignment( valueAssignment: ValueAssignment, currentPath: string[]): any
    visitFusionObjectValue( fusionObjectValue: FusionObjectValue): any
    visitDslExpressionValue( dslExpressionValue: DslExpressionValue, ...args: any[]): any
    visitEelExpressionValue( eelExpressionValue: EelExpressionValue): any
    visitFloatValue( floatValue: FloatValue): any
    visitIntValue( intValue: IntValue): any
    visitBoolValue( boolValue: BoolValue): any
    visitNullValue( nullValue: NullValue): any
    visitStringValue( stringValue: StringValue): any
    visitValueCopy( valueCopy: ValueCopy): any
    visitAssignedObjectPath( assignedObjectPath: AssignedObjectPath): any
    visitValueUnset( valueUnset: ValueUnset): any
    visitCharValue(charValue: CharValue): any

    visitSimpleValue(charValue: SimpleValue): any

}