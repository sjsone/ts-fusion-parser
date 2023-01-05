import { FusionFile } from "../src/fusion/objectTreeParser/ast/FusionFile";
import { ObjectTreeParser } from "../src/lib";

export function parse(text: string, ignoreErrors: boolean): FusionFile {
  return ObjectTreeParser.parse(text, undefined, ignoreErrors)
}