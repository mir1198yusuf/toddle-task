import { handleErrorCatch } from '../lib/handle-catch.error.js';
import { dbKnex } from '../db/knex.db.js';
import { CustomError } from '../lib/custom.error.js';
import { handleTrxFinally } from '../db/handle-trx-finally.db.js';
import { ROLES } from '../constants/roles.constant.js';
import { getClassroomStudents } from './students.service.js';

async function getClassrooms(classroomId, classroomName) {
    try {
        const query = dbKnex.table('classrooms');
        if (classroomId) {
            query.where('id', classroomId);
        }
        if (classroomName) {
            query.where('name', 'like', classroomName);
        }
        const existingClassrooms = await query;
        return existingClassrooms;
    } catch (error) {
        handleErrorCatch(error);
    }
}
async function createClassroomService(name, tutorUserId) {
    let trx;
    try {
        trx = await dbKnex.transaction();
        const existingClassrooms = await getClassrooms(null, name);

        if (existingClassrooms.length) {
            throw new CustomError(
                409,
                'Classroom with same name exists',
                `Classroom with same name exists ${JSON.stringify(
                    existingClassrooms
                )}`
            );
        }
        const newClassroom = await trx
            .table('classrooms')
            .insert({
                name,
                created_by: tutorUserId,
                created_at: 'now()'
            })
            .returning('id');

        return { classroom_id: newClassroom[0].id };
    } catch (error) {
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        await handleTrxFinally(trx);
    }
}

async function updateClassroomService(name, classroomId, tutorUserId) {
    let trx;
    try {
        trx = await dbKnex.transaction();
        let existingClassrooms = await getClassrooms(null, name);
        if (existingClassrooms.length) {
            throw new CustomError(
                409,
                'Classroom name already taken',
                `Classroom name already taken ${JSON.stringify(
                    existingClassrooms
                )}`
            );
        }

        existingClassrooms = await getClassrooms(classroomId, null);
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

        const updatedClassroom = await trx
            .table('classrooms')
            .update({
                name
            })
            .where('id', classroomId)
            .returning('id');

        return { classroom_id: updatedClassroom[0].id };
    } catch (error) {
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        await handleTrxFinally(trx);
    }
}

async function deleteClassroomService(classroomId, tutorUserId) {
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

        const deletedClassroom = await trx
            .table('classrooms')
            .delete()
            .where('id', classroomId)
            .returning('id');

        return { classroom_id: deletedClassroom[0].id };
    } catch (error) {
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        await handleTrxFinally(trx);
    }
}

async function getClassroomFeedService(userId, role) {
    try {
        let result;
        if (role === ROLES.TUTOR) {
            result = await getClassroomFeedForTutor(userId);
        } else if (role === ROLES.STUDENT) {
            result = await getClassroomFeedForStudent(userId);
        }

        return { feeds: result };
    } catch (error) {
        handleErrorCatch(error);
    }
}

async function getClassroomFeedForTutor(userId) {
    try {
        const classes = await dbKnex
            .table('classrooms')
            .select('classrooms.*', 'users.username as created_by_username')
            .innerJoin('users', 'classrooms.created_by', 'users.id')
            .where('classrooms.created_by', userId);
        return classes;
    } catch (error) {
        handleErrorCatch(error);
    }
}

async function getClassroomFeedForStudent(userId) {
    try {
        const classes = await dbKnex
            .table('classrooms')
            .innerJoin(
                'classrooms_students',
                'classrooms.id',
                'classrooms_students.classroom_id'
            )
            .innerJoin('users', 'users.id', 'classrooms.created_by')
            .where('student_user_id', userId)
            .select('classrooms.*', 'users.username  as created_by_username');
        return classes;
    } catch (error) {
        handleErrorCatch(error);
    }
}

async function allowIfUserBelongsToClassroom(
    classroom,
    role,
    userId,
    classroomId = null
) {
    try {
        // classroom object will be provided in param, if not, fetch the classroom. doing this to make this function adaptible to both situations
        if (!classroom) {
            classroom = await getClassrooms(classroomId, null);
            if (!classroom.length) {
                throw new CustomError(
                    404,
                    'Classroom id does not exist',
                    `Classroom id does not exist ${classroomId}`
                );
            }
            classroom = classroom[0];
        }

        let isAllowed = true;
        if (role === ROLES.TUTOR && classroom.created_by !== userId) {
            isAllowed = false;
        } else if (role === ROLES.STUDENT) {
            const classroomStudentMapping = await getClassroomStudents(
                classroom.id,
                [userId]
            );
            if (!classroomStudentMapping.length) isAllowed = false;
        }

        if (!isAllowed) {
            throw new CustomError(
                403,
                'You are not allowed for this classroom',
                `You are not allowed for this classroom ${userId} ${role} ${JSON.stringify(
                    classroom
                )}`
            );
        }
    } catch (error) {
        handleErrorCatch(error);
    }
}

export {
    createClassroomService,
    updateClassroomService,
    deleteClassroomService,
    getClassrooms,
    getClassroomFeedService,
    allowIfUserBelongsToClassroom
};
