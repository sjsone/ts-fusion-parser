import { NodePositionInterface } from "./NodePositionInterface";

export abstract class AbstractNode {
    protected position: NodePositionInterface
    protected parent: AbstractNode | undefined

    constructor(position: NodePositionInterface, parent: AbstractNode | undefined = undefined) {
        this.position = position
        this.parent = parent
    }

    debugPrint(name: string = '', withGroup = true) {
        if (withGroup) console.group(this.constructor.name + (name !== '' ? `[${name}]` : '') + (this.position ? this.debugPositionToString() : ''))
        this.debugPrintInner()
        if (withGroup) console.groupEnd()
    }

    public toString(intend: number = 0): string {
        return '    '.repeat(intend) + `<${this.constructor.name}>`
    }

    protected debugPositionToString() {
        return ' Pos: ' + this.position?.toString()
    }

    protected debugPrintInner() {
        for (const [name, value] of Object.entries(this)) {
            if (value === undefined) {
                continue
            }
            if (Array.isArray(value)) {
                for (const entry of value) {
                    this.debugPrintValue(entry, name)
                }
            } else {
                this.debugPrintValue(value, name)
            }
        }
    }

    protected debugPrintValue(value: any, name: string) {
        if (name === "position") {
            return
        }
        if (value instanceof AbstractNode) {
            value.debugPrint(name)
        } else {
            console.log(`|-${name}`, value)
        }
    }
}