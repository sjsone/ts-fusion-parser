import type { AssignedObjectPath } from "./ast/AssignedObjectPath"
import type { Block } from "./ast/Block"
import type { BoolValue } from "./ast/BoolValue"
import type { CharValue } from "./ast/CharValue"
import type { FloatValue } from "./ast/FloatValue"
import type { FusionFile } from "./ast/FusionFile"
import type { FusionObjectValue } from "./ast/FusionObjectValue"
import type { IncludeStatement } from "./ast/IncludeStatement"
import type { IntValue } from "./ast/IntValue"
import type { MetaPathSegment } from "./ast/MetaPathSegment"
import type { NullValue } from "./ast/NullValue"
import type { ObjectPath } from "./ast/ObjectPath"
import type { ObjectStatement } from "./ast/ObjectStatement"
import type { PathSegment } from "./ast/PathSegment"
import type { PrototypePathSegment } from "./ast/PrototypePathSegment"
import type { SimpleValue } from "./ast/SimpleValue"
import type { StatementList } from "./ast/StatementList"
import type { StringValue } from "./ast/StringValue"
import type { ValueAssignment } from "./ast/ValueAssignment"
import type { ValueCopy } from "./ast/ValueCopy"

export interface AstNodeVisitorInterface
{
    visitFusionFile( fusionFile: FusionFile, ...args: any[]): any
    visitStatementList( statementList: StatementList, ...args: any[]): any
    visitIncludeStatement( includeStatement: IncludeStatement, ...args: any[]): any
    visitObjectStatement( objectStatement: ObjectStatement, ...args: any[]): any
    visitBlock( block: Block, ...args: any[]): any
    visitObjectPath( objectPath: ObjectPath, ...args: any[]): any
    visitMetaPathSegment( metaPathSegment: MetaPathSegment, ...args: any[]): any
    visitPrototypePathSegment( prototypePathSegment: PrototypePathSegment, ...args: any[]): any
    visitPathSegment( pathSegment: PathSegment, ...args: any[]): any
    visitValueAssignment( valueAssignment: ValueAssignment, ...args: any[]): any
    visitFusionObjectValue( fusionObjectValue: FusionObjectValue, ...args: any[]): any
    visitDslExpressionValue( dslExpressionValue: DslExpressionValue, ...args: any[]): any
    visitEelExpressionValue( eelExpressionValue: EelExpressionValue, ...args: any[]): any
    visitFloatValue( floatValue: FloatValue, ...args: any[]): any
    visitIntValue( intValue: IntValue, ...args: any[]): any
    visitBoolValue( boolValue: BoolValue, ...args: any[]): any
    visitNullValue( nullValue: NullValue, ...args: any[]): any
    visitStringValue( stringValue: StringValue, ...args: any[]): any
    visitValueCopy( valueCopy: ValueCopy, ...args: any[]): any
    visitAssignedObjectPath( assignedObjectPath: AssignedObjectPath, ...args: any[]): any
    visitValueUnset( valueUnset: ValueUnset, ...args: any[]): any
    visitCharValue(charValue: CharValue, ...args: any[]): any

    visitSimpleValue(charValue: SimpleValue, ...args: any[]): any

}