import { CustomError } from "./custom-error";

export class databaseConnectionError extends CustomError {
    reason = "database stuff errors 😑"
    statusCode = 500

    constructor() {
        super('database stuff errors')

        Object.setPrototypeOf(this, databaseConnectionError.prototype)
    }

    serializeError() {
        return [{ message: this.reason }]
    }
}