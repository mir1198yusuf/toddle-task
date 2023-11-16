import { CustomError } from '../lib/custom.error.js';

function errorMiddleware(error, req, res, next) {
    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            message: error.displayError,
            data: error.data
        });
    } else {
        console.error(`ERROR_DETAILS : ${error.message} ${error.stack}`);
        res.status(500).json({ message: 'Something went wrong', data: {} });
    }
}

export { errorMiddleware };
