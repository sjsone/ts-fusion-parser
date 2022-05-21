import type { AssignedObjectPath } from "./ast/AssignedObjectPath"
import type { Block } from "./ast/Block"
import type { BoolValue } from "./ast/BoolValue"
import type { CharValue } from "./ast/CharValue"
import type { DslExpressionValue } from "./ast/DslExpressionValue"
import type { EelExpressionValue } from "./ast/EelExpressionValue"
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