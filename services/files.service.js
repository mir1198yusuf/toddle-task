import { handleErrorCatch } from '../lib/handle-catch.error.js';
import { dbKnex } from '../db/knex.db.js';
import { CustomError } from '../lib/custom.error.js';
import { handleTrxFinally } from '../db/handle-trx-finally.db.js';
import {
    allowIfUserBelongsToClassroom,
    getClassrooms
} from './classrooms.service.js';
import { FILE_TYPES } from '../constants/files.constant.js';
import { ROLES } from '../constants/roles.constant.js';
import { nodeEventEmitter } from './node-events.service.js';

async function addFileToClassroomService(
    classroomId,
    fileTitle,
    fileDescription,
    fileType,
    fileUrl,
    fileAttachmentPath,
    tutorUserId
) {
    let trx;
    try {
        trx = await dbKnex.transaction();
        const existingClassrooms = await getClassrooms(classroomId, null);
        if (!existingClassrooms.length) {
            throw new CustomError(
                404,
                'Classroom id does not exist',
                `Classroom id does not exist ${classroomId}`
            );
        }

        await allowIfUserBelongsToClassroom(
            existingClassrooms[0],
            ROLES.TUTOR,
            tutorUserId
        );

        const existingFiles = await getClassroomFiles(classroomId, fileTitle);
        if (existingFiles.length) {
            throw new CustomError(
                409,
                'File with same title exists',
                `File with same title exists ${JSON.stringify(existingFiles)}`
            );
        }

        const newFile = await trx
            .table('classrooms_files')
            .insert({
                classroom_id: classroomId,
                title: fileTitle,
                description: fileDescription,
                created_by: tutorUserId,
                type: fileType,
                url: fileType === FILE_TYPES.URL ? fileUrl : fileAttachmentPath,
                created_at: 'now()'
            })
            .returning('id');
        return {
            file_id: newFile[0].id
        };
    } catch (error) {
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        await handleTrxFinally(trx);
    }
}

async function updateFileService(
    fileId,
    fileTitle,
    fileDescription,
    tutorUserId
) {
    let trx;
    try {
        trx = await dbKnex.transaction();
        const existingFile = await getClassroomFile(fileId);
        if (!existingFile) {
            throw new CustomError(
                404,
                'File id does not exist',
                `File id does not exist ${fileId}`
            );
        }

        await allowIfUserBelongsToClassroom(
            null,
            ROLES.TUTOR,
            tutorUserId,
            existingFile.classroom_id
        );

        const fileUpdateParams = {};
        if (fileTitle) fileUpdateParams.title = fileTitle;
        if (fileDescription) fileUpdateParams.description = fileDescription;

        await trx
            .table('classrooms_files')
            .update(fileUpdateParams)
            .where('id', fileId);

        return {
            file_id: fileId
        };
    } catch (error) {
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        await handleTrxFinally(trx);
    }
}

async function deleteFileService(fileId, tutorUserId) {
    let trx,
        didTrxCommit = true,
        filePathToDelete;
    try {
        trx = await dbKnex.transaction();
        const existingFile = await getClassroomFile(fileId);
        if (!existingFile) {
            throw new CustomError(
                404,
                'File id does not exist',
                `File id does not exist ${fileId}`
            );
        }

        await allowIfUserBelongsToClassroom(
            null,
            ROLES.TUTOR,
            tutorUserId,
            existingFile.classroom_id
        );

        const deletedFile = await trx
            .table('classrooms_files')
            .delete()
            .where('id', fileId)
            .returning(['url', 'type']);

        filePathToDelete =
            deletedFile[0].type !== FILE_TYPES.URL ? deletedFile[0].url : null;

        return {
            file_id: fileId
        };
    } catch (error) {
        didTrxCommit = false;
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        await handleTrxFinally(trx);
        if (didTrxCommit && filePathToDelete) {
            nodeEventEmitter.emit('delete-file-from-server', filePathToDelete);
        }
    }
}

async function getFileFeedService(
    classroomId,
    fileType,
    searchTerm,
    userId,
    role,
    baseServerUrl
) {
    try {
        const existingClassrooms = await getClassrooms(classroomId, null);
        if (!existingClassrooms.length) {
            throw new CustomError(
                404,
                'Classroom id does not exist',
                `Classroom id does not exist ${classroomId}`
            );
        }

        await allowIfUserBelongsToClassroom(
            existingClassrooms[0],
            role,
            userId
        );

        const feedQuery = dbKnex
            .table('classrooms_files')
            .where('classroom_id', classroomId);
        if (fileType) {
            feedQuery.where('type', fileType);
        }
        if (searchTerm) {
            feedQuery.where('title', 'ilike', `%${searchTerm}%`);
        }
        let result = await feedQuery;

        return { feeds: formatFileFeedResponse(result, baseServerUrl) };
    } catch (error) {
        handleErrorCatch(error);
    }
}
function formatFileFeedResponse(feeds, baseServerUrl) {
    try {
        const formattedFeeds = feeds.map((i) => {
            let url = i.url;
            if (i.type !== FILE_TYPES.URL) {
                url = encodeURI(`${baseServerUrl}/${i.url}`);
            }
            return {
                ...i,
                url
            };
        });
        return formattedFeeds;
    } catch (error) {
        handleErrorCatch(error);
    }
}

async function getClassroomFiles(classroomId, fileTitle) {
    try {
        const classroomFiles = await dbKnex
            .table('classrooms_files')
            .where('classroom_id', classroomId)
            .where('title', fileTitle);
        return classroomFiles;
    } catch (error) {
        handleErrorCatch(error);
    }
}

async function getClassroomFile(fileId) {
    try {
        const file = await dbKnex.table('classrooms_files').where('id', fileId);
        return file[0];
    } catch (error) {
        handleErrorCatch(error);
    }
}

export {
    addFileToClassroomService,
    updateFileService,
    deleteFileService,
    getFileFeedService
};
