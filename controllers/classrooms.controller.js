import { getJSONResponseObj } from '../lib/json-response.lib.js';
import {
    createClassroomService,
    deleteClassroomService,
    getClassroomFeedService,
    updateClassroomService
} from '../services/classrooms.service.js';

async function createClassroomController(req, res, next) {
    try {
        const result = await createClassroomService(
            req.body.name,
            res.locals.userId
        );

        res.status(200).json(
            getJSONResponseObj('Classroom created successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

async function updateClassroomController(req, res, next) {
    try {
        const result = await updateClassroomService(
            req.body.name,
            req.params.classroomId,
            res.locals.userId
        );
        res.status(200).json(
            getJSONResponseObj('Classroom updated successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

async function deleteClassroomController(req, res, next) {
    try {
        const result = await deleteClassroomService(
            req.params.classroomId,
            res.locals.userId
        );
        res.status(200).json(
            getJSONResponseObj('Classroom deleted successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

async function getClassroomFeedController(req, res, next) {
    try {
        const result = await getClassroomFeedService(
            res.locals.userId,
            res.locals.role
        );
        res.status(200).json(
            getJSONResponseObj('Classroom feed returned successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

export {
    createClassroomController,
    updateClassroomController,
    deleteClassroomController,
    getClassroomFeedController
};
