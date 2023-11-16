import { handleTrxFinally } from '../db/handle-trx-finally.db.js';
import { dbKnex } from '../db/knex.db.js';
import { CustomError } from '../lib/custom.error.js';
import { handleErrorCatch } from '../lib/handle-catch.error.js';
import jwt from 'jsonwebtoken';

async function signinService(username, password, role) {
    let trx;
    try {
        const isCredentialsValid = checkIfCredentialsValid(
            username,
            password,
            role
        );

        trx = await dbKnex.transaction();
        if (!isCredentialsValid) {
            throw new CustomError(
                401,
                'Invalid credentials',
                `Invalid credentials ${username} ${role}`
            );
        }

        const user = await addUserIfMissing(username, role, trx);

        const token = generateJWT(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET
        );

        return { token, userId: user.id };
    } catch (error) {
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        handleTrxFinally(trx);
    }
}

async function addUserIfMissing(username, role, trx) {
    try {
        let result;
        const existingUser = await trx
            .table('users')
            .where('username', username)
            .select('id', 'role');

        // user sign-ing with same username but different role
        if (existingUser.length && existingUser[0].role !== role) {
            throw new CustomError(
                401,
                'Invalid credentials',
                `Invalid credentials ${existingUser[0].role} ${role}`
            );
        }
        if (!existingUser.length) {
            result = await trx
                .table('users')
                .insert({
                    username,
                    role,
                    created_at: 'now()'
                })
                .returning(['id', 'role']);
            result = result[0];
        } else {
            result = existingUser[0];
        }

        return result;
    } catch (error) {
        handleErrorCatch(error);
    }
}

function checkIfCredentialsValid(username, password, role) {
    return true; // mock authentication
}

function generateJWT(payload, secret) {
    try {
        const token = jwt.sign(payload, secret, { expiresIn: '2 days' });
        return token;
    } catch (error) {
        handleErrorCatch(error);
    }
}

function verifyJWT(token, secret) {
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        handleErrorCatch(error);
    }
}

async function areUserIdsInTargetRole(userIds, targetRole) {
    try {
        const users = await dbKnex
            .table('users')
            .whereIn('id', userIds)
            .where('role', targetRole);

        if (users.length === userIds.length) return true;
        else return false;
    } catch (error) {
        handleErrorCatch(error);
    }
}

export { signinService, verifyJWT, areUserIdsInTargetRole };
