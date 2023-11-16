import { getJSONResponseObj } from '../lib/json-response.lib.js';
import { addStudentsToClassroomService } from '../services/students.service.js';

async function addStudentsToClassroomController(req, res, next) {
    try {
        const result = await addStudentsToClassroomService(
            req.params.classroomId,
            req.body.student_user_ids,
            res.locals.userId
        );
        res.status(200).json(
            getJSONResponseObj(
                'Students added to classroom successfully',
                result
            )
        );
    } catch (error) {
        next(error);
    }
}

export { addStudentsToClassroomController };
