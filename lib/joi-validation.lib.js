import joi from 'joi';
import { CustomError } from './custom.error.js';

function validateWithJoi(schema, payload) {
    const validation = joi.object(schema).validate(payload);
    if (validation.error) {
        throw new CustomError(
            400,
            validation.error.message,
            validation.error.message
        );
    }
}

export { validateWithJoi };
