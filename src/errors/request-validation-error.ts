import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    public errors: ValidationError[]

    statusCode = 400

    constructor(errors: ValidationError[]) {
        super('bad request validation')
        this.errors = errors

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeError() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param }
        })
    }
}