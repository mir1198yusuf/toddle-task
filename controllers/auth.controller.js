import { signinService } from '../services/auth.service.js';
import { getJSONResponseObj } from '../lib/json-response.lib.js';

async function signinController(req, res, next) {
    try {
        const result = await signinService(
            req.body.username,
            req.body.password,
            req.body.role
        );
        res.status(200).json(
            getJSONResponseObj('Jwt returned successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

export { signinController };
