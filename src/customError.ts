// https://stackoverflow.com/a/48342359

export class CustomError extends Error {
    constructor(message?: string) {
        super(message);
        // const actualPrototype = new.target.prototype;

        // if (Object.setPrototypeOf) { Object.setPrototypeOf(this, actualPrototype); }
        // else { (<any>this)["__proto__"] = actualPrototype; }
    }
}