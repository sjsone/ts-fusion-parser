import { Runtime } from "../../core/runtime";

export class LazyProps //  implements \ArrayAccess, \Iterator, \JsonSerializable
{

    /**
     * @var array
     */
    private valueCache = [];

    /**
     * @var string
     */
    private parentPath: string;

    /**
     * @var Runtime
     */
    private runtime;

    /**
     * Index of keys
     *
     * @var array
     */
    private keys;

    /**
     * @var object
     */
    private fusionObject;

    /**
     * @var array
     */
    private effectiveContext;

    public constructor(
        fusionObject: { [key: string]: any },
        parentPath: string,
        runtime: Runtime,
        keys: string[],
        effectiveContext: { [key: string]: any }
    ) {
        this.fusionObject = fusionObject;
        this.parentPath = parentPath;
        this.runtime = runtime;
        this.keys = keys // array_flip(keys);
        this.effectiveContext = effectiveContext;
    }

    // public offsetExists(path): bool
    // {
    //     return array_key_exists(path, this.keys);
    // }

    // public offsetGet(path): mixed
    // {
    //     if (!array_key_exists(path, this.valueCache)) {
    //         this.runtime->pushContextArray(this.effectiveContext);
    //         try {
    //             this.valueCache[path] = this.runtime->evaluate(this.parentPath . '/' . path, this.fusionObject);
    //         } finally {
    //             this.runtime->popContext();
    //         }
    //     }
    //     return this.valueCache[path];
    // }

    // public offsetSet(path, value): void
    // {
    //     throw new BadMethodCallException('Lazy props can not be set.', 1588182804);
    // }

    // public offsetUnset(path): void
    // {
    //     throw new BadMethodCallException('Lazy props can not be unset.', 1588182805);
    // }

    // public current(): mixed
    // {
    //     path = key(this.keys);
    //     if (path === null) {
    //         return null;
    //     }
    //     return this.offsetGet(path);
    // }

    // public next(): void
    // {
    //     next(this.keys);
    // }

    // public key(): mixed
    // {
    //     return key(this.keys);
    // }

    // public valid(): bool
    // {
    //     return current(this.keys) !== false;
    // }

    // public rewind(): void
    // {
    //     reset(this.keys);
    // }

    // public jsonSerialize(): mixed
    // {
    //     return iterator_to_array(this);
    // }

}
