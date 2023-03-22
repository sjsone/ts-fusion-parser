export class Arrays {
    // public static arrayMergeRecursiveOverrule(firstArray: { [key: string]: any }, secondArray: { [key: string]: any }, doNotAddNewKeys = false, emptyValuesOverride = true): { [key: string]: any } {
    //     for (const [key, value] of Object.entries(secondArray)) {
    //         if (firstArray[key] !== undefined && typeof firstArray[key] === "object") {
    //             if ((!emptyValuesOverride || value.length > 0) && Array.isArray(value)) {
    //                 firstArray[key] = this.arrayMergeRecursiveOverrule(firstArray[key], value, doNotAddNewKeys, emptyValuesOverride);
    //             } else {
    //                 firstArray[key] = value;
    //             }
    //         } else {
    //             if (!doNotAddNewKeys || Object.keys(firstArray).includes(key)) {
    //                 if (emptyValuesOverride || !value || value.length > 0) {
    //                     firstArray[key] = value;
    //                 }
    //             }
    //         }
    //     }
    //     return firstArray;
    // }

    public static arrayMergeRecursiveOverrule(firstArray: { [key: string]: any }, secondArray: { [key: string]: any }, doNotAddNewKeys = false, emptyValuesOverride = true): { [key: string]: any } {
        for (const [key, value] of Object.entries(secondArray)) {
            if (firstArray[key] !== undefined && firstArray[key] !== null && typeof firstArray[key] === "object") {
                firstArray[key] = this.arrayMergeRecursiveOverrule(firstArray[key], value, doNotAddNewKeys, emptyValuesOverride);
            } else {
                if (!doNotAddNewKeys || Object.keys(firstArray).includes(key)) {
                    firstArray[key] = emptyValuesOverride || !value || value.length > 0 ? value : firstArray[key];
                }
            }
        }
        return firstArray;
    }

    public static unsetValueByPath(arr: { [key: string]: any }, path: string | string[]): { [key: string]: any } {
        if (typeof path === "string") {
            path = path.split(".");
        } else if (!Array.isArray(path)) {
            throw new Error("unsetValueByPath() expects path to be string or array");
        }
        const [key, ...remainingPath] = path;
        if (!remainingPath.length) {
            delete arr[key];
        } else if (typeof arr[key] === "object") {
            arr[key] = this.unsetValueByPath(arr[key], remainingPath);
        }
        return arr;
    }


    public static getValueByPath(array: { [key: string]: any }, path: string | string[]): null | any {
        if (typeof path === "string") {
            path = path.split('.');
        } else if (!(typeof path === "object")) {
            throw new Error('getValueByPath() expects path to be string or array, "' + (typeof path) + '" given.')
            // throw new \InvalidArgumentException('getValueByPath() expects path to be string or array, "' . gettype(path) . '" given.', 1304950007);
        }
        const key = path.shift();
        if (key !== undefined && array[key] !== undefined) {
            if (path.length > 0) {
                return (typeof array[key] === "object") ? this.getValueByPath(array[key], path) : null;
            } else {
                return array[key];
            }
        } else {
            return null;
        }
    }

    public static mergeArraysRecursively(firstArray: { [key: string]: any }, secondArray: { [key: string]: any }, toArray: (value: any) => any, overrideFirst: ((key: string, firstValue: any, secondValue: any) => boolean) | null = null): { [key: string]: any } {
        const data = [firstArray, secondArray];
        let entryCount = 1;
        for (let i = 0; i < entryCount; i++) {
            const firstArrayInner = data[i * 2];
            const secondArrayInner = data[i * 2 + 1];

            for (const key in secondArrayInner) {
                let value = secondArrayInner[key];
                if (firstArrayInner[key] === undefined || typeof firstArrayInner[key] !== "object" || typeof value !== "object") {
                    firstArrayInner[key] = value;
                } else {
                    if (typeof value !== "object") {
                        value = toArray(value);
                    }

                    if (typeof firstArrayInner[key] !== "object") {
                        firstArrayInner[key] = toArray(firstArrayInner[key]);
                    }

                    if (typeof firstArrayInner[key] === "object" && typeof value === "object") {
                        if (overrideFirst && overrideFirst(key, firstArrayInner[key], value)) {
                            firstArrayInner[key] = value;
                        } else {
                            data.push(firstArrayInner[key], value);
                            entryCount += 1;
                        }
                    } else {
                        firstArrayInner[key] = value;
                    }
                }
            }
        }
        return firstArray;
    }

}