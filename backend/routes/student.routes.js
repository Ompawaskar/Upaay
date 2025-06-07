import {Router} from 'express';

import { handleCreateStudent, handleGetStudentsOfScheduledClass, handleMarkAttendance } from '../controllers/student.controller.js';

const router = Router();

router.get('/get-students-class-schedule/:scheduleId',handleGetStudentsOfScheduledClass)

router.post('/mark-attendance/:id', handleMarkAttendance);
router.post('/create',handleCreateStudent);



export default router;