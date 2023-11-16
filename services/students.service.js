import { handleErrorCatch } from '../lib/handle-catch.error.js';
import { dbKnex } from '../db/knex.db.js';
import { CustomError } from '../lib/custom.error.js';
import { handleTrxFinally } from '../db/handle-trx-finally.db.js';
import {
    allowIfUserBelongsToClassroom,
    getClassrooms
} from './classrooms.service.js';
import { ROLES } from '../constants/roles.constant.js';
import { areUserIdsInTargetRole } from './auth.service.js';

async function addStudentsToClassroomService(
    classroomId,
    studentUserIds,
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

        const existingStudents = (
            await getClassroomStudents(classroomId, studentUserIds)
        ).map((i) => i.student_user_id);

        const newStudents = studentUserIds.filter((su) => {
            if (existingStudents.includes(su)) return false;
            else return true;
        });

        const areAllStudents = await areUserIdsInTargetRole(
            newStudents,
            ROLES.STUDENT
        );
        if (!areAllStudents) {
            throw new CustomError(
                403,
                'Not all are student user ids',
                `Not all are student user ids ${JSON.stringify(newStudents)}`
            );
        }

        newStudents.length &&
            (await trx.table('classrooms_students').insert(
                newStudents.map((i) => ({
                    created_at: 'now()',
                    classroom_id: classroomId,
                    student_user_id: i
                }))
            ));

        return {
            new_students: newStudents,
            existing_students: existingStudents
        };
    } catch (error) {
        await trx.rollback();
        handleErrorCatch(error);
    } finally {
        await handleTrxFinally(trx);
    }
}

async function getClassroomStudents(classroomId, studentUserIds) {
    try {
        const classroomStudents = await dbKnex
            .table('classrooms_students')
            .where('classroom_id', classroomId)
            .whereIn('student_user_id', studentUserIds)
            .select('student_user_id');
        return classroomStudents;
    } catch (error) {
        handleErrorCatch(error);
    }
}

export { addStudentsToClassroomService, getClassroomStudents };
