import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 400

    constructor() {
        super('not found end-point')

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeError() {
        return [{ message: 'not found' }]
    }
}