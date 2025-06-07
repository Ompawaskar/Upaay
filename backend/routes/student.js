import {Router} from 'express';

const {handleGetStudentsOfScheduledClass} = require('../controllers/students');

const router = Router();

router.get('/get-students-class-schedule/:scheduleId',handleGetStudentsOfScheduledClass)

router.post('/mark-attendance/:id', handleMarkAttendance);



export default router;