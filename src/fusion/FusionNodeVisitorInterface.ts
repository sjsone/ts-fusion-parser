import { NodeVisitorInterface } from "../common/NodeVisitorInterface"
import { AssignedObjectPath } from "./nodes/AssignedObjectPath"
import { Block } from "./nodes/Block"
import { BoolValue } from "./nodes/BoolValue"
import { CharValue } from "./nodes/CharValue"
import { DslExpressionValue } from "./nodes/DslExpressionValue"
import { EelExpressionValue } from "./nodes/EelExpressionValue"
import { FloatValue } from "./nodes/FloatValue"
import { FusionFile } from "./nodes/FusionFile"
import { FusionObjectValue } from "./nodes/FusionObjectValue"
import { IncludeStatement } from "./nodes/IncludeStatement"
import { IntValue } from "./nodes/IntValue"
import { MetaPathSegment } from "./nodes/MetaPathSegment"
import { NullValue } from "./nodes/NullValue"
import { ObjectPath } from "./nodes/ObjectPath"
import { ObjectStatement } from "./nodes/ObjectStatement"
import { PathSegment } from "./nodes/PathSegment"
import { PrototypePathSegment } from "./nodes/PrototypePathSegment"
import { SimpleValue } from "./nodes/SimpleValue"
import { StatementList } from "./nodes/StatementList"
import { StringValue } from "./nodes/StringValue"
import { ValueAssignment } from "./nodes/ValueAssignment"
import { ValueCopy } from "./nodes/ValueCopy"
import { ValueUnset } from "./nodes/ValueUnset"

export interface FusionNodeVisitorInterface<T> extends NodeVisitorInterface<T> {

    visitFusionFile(fusionFile: FusionFile): T
    visitStatementList(statementList: StatementList): T
    visitIncludeStatement(includeStatement: IncludeStatement): T
    visitObjectStatement(objectStatement: ObjectStatement, ...args: T[]): T
    visitBlock(block: Block, currentPath: T[] | null): T
    visitObjectPath(objectPath: ObjectPath, ...args: T[]): T
    visitMetaPathSegment(metaPathSegment: MetaPathSegment): T
    visitPrototypePathSegment(prototypePathSegment: PrototypePathSegment): T
    visitPathSegment(pathSegment: PathSegment): T
    visitValueAssignment(valueAssignment: ValueAssignment, currentPath: string[]): T
    visitFusionObjectValue(fusionObjectValue: FusionObjectValue): T
    visitDslExpressionValue(dslExpressionValue: DslExpressionValue, ...args: T[]): T
    visitEelExpressionValue(eelExpressionValue: EelExpressionValue): T
    visitFloatValue(floatValue: FloatValue): T
    visitIntValue(intValue: IntValue): T
    visitBoolValue(boolValue: BoolValue): T
    visitNullValue(nullValue: NullValue): T
    visitStringValue(stringValue: StringValue): T
    visitValueCopy(valueCopy: ValueCopy): T
    visitAssignedObjectPath(assignedObjectPath: AssignedObjectPath): T
    visitValueUnset(valueUnset: ValueUnset): T
    visitCharValue(charValue: CharValue): T

    visitSimpleValue(charValue: SimpleValue): T


}