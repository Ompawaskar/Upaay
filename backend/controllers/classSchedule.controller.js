import Student from "../models/student.js";

const handleMarkAttendance = async (req, res) => {
    console.log(req.body);
    const slotID = req.params.id;
    const { studentsID } = req.body;
    console.log(studentsID, slotID);

    try {
        for (const studentId of studentsID) {
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: `Student with ID ${studentId} not found` });
            }
            if (student.attendance.includes(slotID)) {
                return res.status(400).json({ message: `Attendance already marked for student ID ${studentId}` });
            }
            student.attendance.push(slotID);
            await student.save();
        }
        return res.status(200).json({ message: "Attendance marked successfully for all students" });
    } catch (error) {
        console.error("Error marking attendance:", error);
        return res.status(500).json({ message: "Error marking attendance" });
    }
};

export {handleMarkAttendance}