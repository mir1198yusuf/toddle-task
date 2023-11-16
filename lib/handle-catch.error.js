import { CustomError } from './custom.error.js';

function handleErrorCatch(error) {
    if (error instanceof CustomError) {
        throw error;
    } else {
        throw new CustomError(
            500,
            'Something went wrong',
            error.response ? JSON.stringify(error) : error.stack
        );
    }
}

export { handleErrorCatch };
