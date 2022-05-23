import { AbstractFusionObject } from "./abstractFusionObject";

class FusionObjectManager {
    protected classes: Map<string, typeof AbstractFusionObject> = new Map

    protected debug = false

    get(name: string) {
        name = this.sanitizeName(name)
        return this.classes.get(name)
    }

    set(name: string, fusionObjectClass: typeof AbstractFusionObject) {
        name = this.sanitizeName(name)
        if(this.debug) console.log("(FusionObjectManager) added", name)
        this.classes.set(name, fusionObjectClass)
    }

    has(name: string) {
        name = this.sanitizeName(name)
        if(this.debug) console.log("(FusionObjectManager) checked", name)
        return this.classes.has(name)
    }

    sanitizeName(name: string) {

        const san = name.split('\\').filter(Boolean).join('\\')
        if(this.debug) console.log(`#####    Sanitized "${name}" to "${san}"`)
        return san
    }
}

const FusionObjectManagerInstance = new FusionObjectManager

export {FusionObjectManagerInstance as FusionObjectManager}