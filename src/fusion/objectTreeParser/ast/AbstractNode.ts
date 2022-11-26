import { NodePosition } from "../../../common/NodePosition";

export abstract class AbstractNode {
    protected position: NodePosition|undefined = undefined
    protected parent: AbstractNode|undefined = undefined


    debugPrint(name: string = '', withGroup = true) {
        if(withGroup) console.group(this.constructor.name + (name !== '' ? `[${name}]`: '' ) + ( this.position ? this.debugPositionToString() : ''))
        this.debugPrintInner()
        if(withGroup) console.groupEnd()
    }

    protected debugPositionToString() {
        return ' Pos: '+ this.position?.toString()
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
        if(value instanceof NodePosition) {
            return
        }
        if(value instanceof AbstractNode) {
            value.debugPrint(name)
        } else {
            console.log(`|-${name}`, value)
        }
    }
}
