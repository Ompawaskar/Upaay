import mongoose from "mongoose";
import Student from "../models/student.js";
import ClassSchedule from "../models/classSchedule.schema.js";


const handleGetStudentsOfScheduledClass = async(req,res)=>{
    const scheduleId = req.params.scheduleId;
    console.log("Fetching students for class schedule:", scheduleId);

    try {
        const classSchedule = await ClassSchedule.findById(scheduleId)
        if(!classSchedule){
            return res.status(404).json({message: "Class schedule not found"});
        }

        try {
            const students = await Student.find({location: classSchedule.location, level: classSchedule.level})
            if(!students || students.length === 0){
                return res.status(404).json({message: "No students found for this class schedule"});
            }
            return res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students:", error);
            return res.status(500).json({message: "Error fetching students"});
        }
    } catch (error) {
        console.error("Error fetching class schedule:", error);
        return res.status(500).json({message: "Error fetching class schedule"});
    }
}

const handleMarkAttendance = async (req, res) => {
    const studentId = req.params.id;
    const {slotId} = req.body;
    console.log(studentId, slotId);

    try {
        const updatedStudent = await Student.findById(studentId);
        if (!updatedStudent) {
            return res.status(404).json({message: "Student not found"});
        }
        updatedStudent.attendance.push(slotId);
        await updatedStudent.save();
    } catch (error) {
        console.error("Error marking attendance:", error);
        return res.status(500).json({message: "Error marking attendance"});
    }


}

module.exports = {handleGetStudentsOfScheduledClass, handleMarkAttendance};