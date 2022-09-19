export * from "./core/parser";
export * from "./core/objectTreeParser/objectTreeParser"
export * from "./core/token"
export * from "./core/lexer"
export * from "./core/arrays"

import * as AbstractNode from "./core/objectTreeParser/ast/AbstractNode"
import * as AbstractOperation from "./core/objectTreeParser/ast/AbstractOperation"
import * as AbstractPathSegment from "./core/objectTreeParser/ast/AbstractPathSegment"
import * as AbstractPathValue from "./core/objectTreeParser/ast/AbstractPathValue"
import * as AbstractStatement from "./core/objectTreeParser/ast/AbstractStatement"
import * as AssignedObjectPath from "./core/objectTreeParser/ast/AssignedObjectPath"
import * as Block from "./core/objectTreeParser/ast/Block"
import * as BoolValue from "./core/objectTreeParser/ast/BoolValue"
import * as CharValue from "./core/objectTreeParser/ast/CharValue"
import * as DslExpressionValue from "./core/objectTreeParser/ast/DslExpressionValue"
import * as EelExpressionValue from "./core/objectTreeParser/ast/EelExpressionValue"
import * as FloatValue from "./core/objectTreeParser/ast/FloatValue"
import * as FusionFile from "./core/objectTreeParser/ast/FusionFile"
import * as FusionObjectValue from "./core/objectTreeParser/ast/FusionObjectValue"
import * as IncludeStatement from "./core/objectTreeParser/ast/IncludeStatement"
import * as IntValue from "./core/objectTreeParser/ast/IntValue"
import * as MetaPathSegment from "./core/objectTreeParser/ast/MetaPathSegment"
import * as NodePosition from "./core/objectTreeParser/ast/NodePosition"
import * as NullValue from "./core/objectTreeParser/ast/NullValue"
import * as ObjectPath from "./core/objectTreeParser/ast/ObjectPath"
import * as ObjectStatement from "./core/objectTreeParser/ast/ObjectStatement"
import * as PathSegment from "./core/objectTreeParser/ast/PathSegment"
import * as PrototypePathSegment from "./core/objectTreeParser/ast/PrototypePathSegment"
import * as SimpleValue from "./core/objectTreeParser/ast/SimpleValue"
import * as StatementList from "./core/objectTreeParser/ast/StatementList"
import * as StringValue from "./core/objectTreeParser/ast/StringValue"
import * as ValueAssignment from "./core/objectTreeParser/ast/ValueAssignment"
import * as ValueCopy from "./core/objectTreeParser/ast/ValueCopy"
import * as ValueUnset from "./core/objectTreeParser/ast/ValueUnset"

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