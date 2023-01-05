import { NodePositionInterface } from "./NodePositionInterface";

export abstract class AbstractNode {
    protected position: NodePositionInterface
    protected parent: AbstractNode | null

    constructor(position: NodePositionInterface, parent: AbstractNode | null = null) {
        this.position = position
        this.parent = parent
    }

    debugPrint(name: string = '', withGroup = true): void {
        if(withGroup) console.group(this.constructor.name + (name !== '' ? `[${name}]`: '' ) + ( this.position ? this.debugPositionToString() : ''))
        this.debugPrintInner()
        if(withGroup) console.groupEnd()
    }

    protected debugPositionToString(): string {
        return ' Pos: '+ this.position!.toString()
    }

    protected debugPrintInner(): void {
        for(const entry of Object.entries(this)) {
            const name = entry[0]
            const value = entry[1]

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

    protected debugPrintValue(value: any, name: string): void {
        if(name === "position") {
            return
        }
        if(value instanceof AbstractNode) {
            value.debugPrint(name)
        } else {
            console.log(`|-${name}`, value)
        }
    }
}