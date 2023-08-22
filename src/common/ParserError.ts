import { CustomError } from "../customError";

export class ParserError extends CustomError {
    protected position: number

    constructor(message: string, position: number) {
        super(message)
        this.position = position
    }

    getPosition() {
        return this.position
    }
}