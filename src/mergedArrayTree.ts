import { Arrays } from "./arrays";

export class MergedArrayTree {
    protected tree: { [key: string]: any } = []
    public constructor(tree: Array<any>) {
        this.tree = tree
    }

    public static pathIsPrototype(path: string[]): boolean {
        return (path[path.length - 2] ?? null) === '__prototypes';
    }

    public static getParentPath(path: string[]): any[] {
        if (MergedArrayTree.pathIsPrototype(path)) {
            return array_slice(path, 0, -2);
        }
        return array_slice(path, 0, -1);
    }

    public getTree(): { [key: string]: any } {
        return this.tree;
    }

    public removeValueInTree(path: string[]): void {
        this.tree = Arrays.unsetValueByPath(this.tree, path);
        this.setValueInTree(path, {'__stopInheritanceChain': true});
    }

    public copyValueInTree(targetPath: string, sourcePath: string): void {
        const originalValue = Arrays.getValueByPath(this.tree, sourcePath);
        this.setValueInTree(targetPath, originalValue);
    }

    /**
     * @param scalar|null|array value The value to assign, either a scalar type or an array with __eelExpression etc.
     */
    public setValueInTree(path: Array<any>, value: any): void {
        MergedArrayTree.arraySetOrMergeValueByPathWithCallback(this.tree, path, value,  (simpleType: any) => {
            return {
                '__value': simpleType,
                '__eelExpression': null,
                '__objectType': null
            }
        });
    }

    protected static arraySetOrMergeValueByPathWithCallback(subject: { [key: string]: any }, path: string[], value: any, toArray: (value: any) => { [key: string]: any }): void {
        // points to the current path element, but inside the tree.
        let pointer = subject;
        for (const pathSegment of path) {
            // can be null because `&foo['undefined'] === null`
            if (pointer === null) {
                pointer = [];
            }
            if (Array.isArray(pointer)) {
                pointer = toArray(pointer);
            }
            // set pointer to current path (we can access undefined indexes due to &)
            pointer = pointer[pathSegment];
        }
        // we got a reference &pointer of the path in the subject array, setting the final value:
        if (Array.isArray(pointer)) {
            const arrayValue = Array.isArray(value) ? value : toArray(value);
            pointer = Arrays.arrayMergeRecursiveOverrule(pointer, arrayValue);
            return;
        }
        pointer = value;
    }

    /**
     * Precalculate merged configuration for inherited prototypes.
     *
     * @throws Fusion\Exception
     */
    public buildPrototypeHierarchy(): void {
        if (this.tree['__prototypes'] === undefined) {
            return;
        }

        for (const prototypeName of Object.keys(this.tree['__prototypes'])) {
            const prototypeInheritanceHierarchy: any[] = [];
            let currentPrototypeName = prototypeName;
            while (this.tree['__prototypes'][currentPrototypeName]['__prototypeObjectName'] !== undefined) {
                currentPrototypeName = this.tree['__prototypes'][currentPrototypeName]['__prototypeObjectName'];
                prototypeInheritanceHierarchy.unshift(currentPrototypeName)
                if (prototypeName === currentPrototypeName) {
                    // TODO: Throw Fusion\Exception
                    throw new Error(`Recursive inheritance found for prototype "{prototypeName}". Prototype chain: {prototypeInheritanceHierarchy.reverse().join(' < ')}`)
                }
            }

            if (prototypeInheritanceHierarchy.length) {
                // prototype chain from most *general* to most *specific* WITHOUT the current node type!
                this.tree['__prototypes'][prototypeName]['__prototypeChain'] = prototypeInheritanceHierarchy;
            }
        }

    }
}