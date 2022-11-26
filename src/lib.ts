export * from "./fusion/parser";
export * from "./fusion/objectTreeParser/objectTreeParser"
export * from "./fusion/token"
export * from "./fusion/lexer"
export * from "./fusion/arrays"

import * as AbstractNode from "./common/AbstractNode"
import * as AbstractOperation from "./fusion/objectTreeParser/ast/AbstractOperation"
import * as AbstractPathSegment from "./fusion/objectTreeParser/ast/AbstractPathSegment"
import * as AbstractPathValue from "./fusion/objectTreeParser/ast/AbstractPathValue"
import * as AbstractStatement from "./fusion/objectTreeParser/ast/AbstractStatement"
import * as AssignedObjectPath from "./fusion/objectTreeParser/ast/AssignedObjectPath"
import * as Block from "./fusion/objectTreeParser/ast/Block"
import * as BoolValue from "./fusion/objectTreeParser/ast/BoolValue"
import * as CharValue from "./fusion/objectTreeParser/ast/CharValue"
import * as DslExpressionValue from "./fusion/objectTreeParser/ast/DslExpressionValue"
import * as EelExpressionValue from "./fusion/objectTreeParser/ast/EelExpressionValue"
import * as FloatValue from "./fusion/objectTreeParser/ast/FloatValue"
import * as FusionFile from "./fusion/objectTreeParser/ast/FusionFile"
import * as FusionObjectValue from "./fusion/objectTreeParser/ast/FusionObjectValue"
import * as IncludeStatement from "./fusion/objectTreeParser/ast/IncludeStatement"
import * as IntValue from "./fusion/objectTreeParser/ast/IntValue"
import * as MetaPathSegment from "./fusion/objectTreeParser/ast/MetaPathSegment"
import * as NodePosition from "./common/NodePosition"
import * as NullValue from "./fusion/objectTreeParser/ast/NullValue"
import * as ObjectPath from "./fusion/objectTreeParser/ast/ObjectPath"
import * as ObjectStatement from "./fusion/objectTreeParser/ast/ObjectStatement"
import * as PathSegment from "./fusion/objectTreeParser/ast/PathSegment"
import * as PrototypePathSegment from "./fusion/objectTreeParser/ast/PrototypePathSegment"
import * as SimpleValue from "./fusion/objectTreeParser/ast/SimpleValue"
import * as StatementList from "./fusion/objectTreeParser/ast/StatementList"
import * as StringValue from "./fusion/objectTreeParser/ast/StringValue"
import * as ValueAssignment from "./fusion/objectTreeParser/ast/ValueAssignment"
import * as ValueCopy from "./fusion/objectTreeParser/ast/ValueCopy"
import * as ValueUnset from "./fusion/objectTreeParser/ast/ValueUnset"

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