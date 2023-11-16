import { CustomError } from '../lib/custom.error.js';

function routeNotFoundMiddleware(req, res, next) {
    throw new CustomError(
        404,
        'Route not found',
        `Route not found : ${req.protocol}://${req.get('host')}${
            req.originalUrl
        }`
    );
}

export { routeNotFoundMiddleware };
