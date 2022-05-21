import { AbstractFusionObject } from "./abstractFusionObject";

class FusionObjectManager {
    protected classes: Map<string, typeof AbstractFusionObject> = new Map

    get(name: string) {
        return this.classes.get(name)
    }

    set(name: string, fusionObjectClass: typeof AbstractFusionObject) {
        this.classes.set(name, fusionObjectClass)
    }

    has(name: string) {
        return this.classes.has(name)
    }
}

const FusionObjectManagerInstance = new FusionObjectManager

export {FusionObjectManagerInstance as FusionObjectManager}