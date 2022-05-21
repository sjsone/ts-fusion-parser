import { AstNodeVisitorInterface } from "../astNodeVisitorInterface";

export abstract class AbstractNode {
    public abstract visit(visitor: AstNodeVisitorInterface, ...args: any[]): any

    debugPrint(name: string = '', withGroup = true) {
        if(withGroup) console.group(this.constructor.name + (name !== '' ? `[${name}]`: '' ))
        this.debugPrintInner()
        if(withGroup) console.groupEnd()
    }

    protected debugPrintInner() {
        for(const [name, value] of Object.entries(this)) {
            if(value === undefined) {
                continue
            }
            if(Array.isArray(value)) {
                for(const entry of value) {
                    this.debugPrintValue(entry, name)
                }
            } else {
                this.debugPrintValue(value, name)
            }
        }
    }

    protected debugPrintValue(value: any, name: string) {
        if(value instanceof AbstractNode) {
            value.debugPrint(name)
        } else {
            console.log(`|-${name}`, value)
        }
    }
}
