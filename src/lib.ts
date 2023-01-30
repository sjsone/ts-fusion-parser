export * from "./fusion/parser"
export * from "./fusion/token"
export * from "./fusion/lexer"
export * from "./fusion/arrays"

import * as AbstractNode from "./common/AbstractNode"
import * as AbstractOperation from "./fusion/nodes/AbstractOperation"
import * as AbstractPathSegment from "./fusion/nodes/AbstractPathSegment"
import * as AbstractPathValue from "./fusion/nodes/AbstractPathValue"
import * as AbstractStatement from "./fusion/nodes/AbstractStatement"
import * as AssignedObjectPath from "./fusion/nodes/AssignedObjectPath"
import * as Block from "./fusion/nodes/Block"
import * as BoolValue from "./fusion/nodes/BoolValue"
import * as CharValue from "./fusion/nodes/CharValue"
import * as DslExpressionValue from "./fusion/nodes/DslExpressionValue"
import * as EelExpressionValue from "./fusion/nodes/EelExpressionValue"
import * as FloatValue from "./fusion/nodes/FloatValue"
import * as FusionFile from "./fusion/nodes/FusionFile"
import * as FusionObjectValue from "./fusion/nodes/FusionObjectValue"
import * as IncludeStatement from "./fusion/nodes/IncludeStatement"
import * as IntValue from "./fusion/nodes/IntValue"
import * as MetaPathSegment from "./fusion/nodes/MetaPathSegment"
import * as NodePosition from "./common/NodePosition"
import * as NullValue from "./fusion/nodes/NullValue"
import * as ObjectPath from "./fusion/nodes/ObjectPath"
import * as ObjectStatement from "./fusion/nodes/ObjectStatement"
import * as PathSegment from "./fusion/nodes/PathSegment"
import * as PrototypePathSegment from "./fusion/nodes/PrototypePathSegment"
import * as SimpleValue from "./fusion/nodes/SimpleValue"
import * as StatementList from "./fusion/nodes/StatementList"
import * as StringValue from "./fusion/nodes/StringValue"
import * as ValueAssignment from "./fusion/nodes/ValueAssignment"
import * as ValueCopy from "./fusion/nodes/ValueCopy"
import * as ValueUnset from "./fusion/nodes/ValueUnset"

export const Nodes = {
    ... AbstractNode,
    ... AbstractOperation,
    ... AbstractPathSegment,
    ... AbstractPathValue,
    ... AbstractStatement,
    ... AssignedObjectPath,
    ... Block,
    ... BoolValue,
    ... CharValue,
    ... DslExpressionValue,
    ... EelExpressionValue,
    ... FloatValue,
    ... FusionFile,
    ... FusionObjectValue,
    ... IncludeStatement,
    ... IntValue,
    ... MetaPathSegment,
    ... NodePosition,
    ... NullValue,
    ... ObjectPath,
    ... ObjectStatement,
    ... PathSegment,
    ... PrototypePathSegment,
    ... SimpleValue,
    ... StatementList,
    ... StringValue,
    ... ValueAssignment,
    ... ValueCopy,
    ... ValueUnset   
}