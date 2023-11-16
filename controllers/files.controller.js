import { getJSONResponseObj } from '../lib/json-response.lib.js';
import { getBaseUrlOfServer } from '../lib/utils.lib.js';
import {
    addFileToClassroomService,
    deleteFileService,
    getFileFeedService,
    updateFileService
} from '../services/files.service.js';

async function addFileToClassroomController(req, res, next) {
    try {
        const result = await addFileToClassroomService(
            req.params.classroomId,
            req.body.title,
            req.body.description,
            req.body.type,
            req.body.url,
            req.file?.path,
            res.locals.userId
        );
        res.status(200).json(
            getJSONResponseObj('File added to classroom successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

async function updateFileController(req, res, next) {
    try {
        const result = await updateFileService(
            req.params.fileId,
            req.body.title,
            req.body.description,
            res.locals.userId
        );
        res.status(200).json(
            getJSONResponseObj('File updated successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

async function deleteFileController(req, res, next) {
    try {
        const result = await deleteFileService(
            req.params.fileId,
            res.locals.userId
        );
        res.status(200).json(
            getJSONResponseObj('File deleted successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

async function getFileFeedController(req, res, next) {
    try {
        const result = await getFileFeedService(
            req.params.classroomId,
            req.query.fileType,
            req.query.search,
            res.locals.userId,
            res.locals.role,
            getBaseUrlOfServer(req.protocol, req.headers['host'])
        );
        res.status(200).json(
            getJSONResponseObj('File feed returned successfully', result)
        );
    } catch (error) {
        next(error);
    }
}

export {
    addFileToClassroomController,
    updateFileController,
    deleteFileController,
    getFileFeedController
};
