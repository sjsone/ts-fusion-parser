import type { AssignedObjectPath } from "../fusion/nodes/AssignedObjectPath"
import type { Block } from "../fusion/nodes/Block"
import type { BoolValue } from "../fusion/nodes/BoolValue"
import type { CharValue } from "../fusion/nodes/CharValue"
import type { DslExpressionValue } from "../fusion/nodes/DslExpressionValue"
import type { EelExpressionValue } from "../fusion/nodes/EelExpressionValue"
import type { FloatValue } from "../fusion/nodes/FloatValue"
import type { FusionFile } from "../fusion/nodes/FusionFile"
import type { FusionObjectValue } from "../fusion/nodes/FusionObjectValue"
import type { IncludeStatement } from "../fusion/nodes/IncludeStatement"
import type { IntValue } from "../fusion/nodes/IntValue"
import type { MetaPathSegment } from "../fusion/nodes/MetaPathSegment"
import type { NullValue } from "../fusion/nodes/NullValue"
import type { ObjectPath } from "../fusion/nodes/ObjectPath"
import type { ObjectStatement } from "../fusion/nodes/ObjectStatement"
import type { PathSegment } from "../fusion/nodes/PathSegment"
import type { PrototypePathSegment } from "../fusion/nodes/PrototypePathSegment"
import type { SimpleValue } from "../fusion/nodes/SimpleValue"
import type { StatementList } from "../fusion/nodes/StatementList"
import type { StringValue } from "../fusion/nodes/StringValue"
import type { ValueAssignment } from "../fusion/nodes/ValueAssignment"
import type { ValueCopy } from "../fusion/nodes/ValueCopy"
import { ValueUnset } from "../fusion/nodes/ValueUnset"

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