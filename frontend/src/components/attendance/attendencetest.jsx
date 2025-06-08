import React, { useEffect, useState, useRef } from 'react';
import { Upload, Camera, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const AttendanceTest = () => {
  // Sample student data - you can replace this with actual data from your backend
  const [students, setStudents] = useState([
    {
      _id: 'ENR001',
      name: 'Tharunika L',
      image: null,
      attendance: false
    },
    {
      _id: 'ENR002',
      name: 'Gouri Varma',
      image: null,
      attendance: false
    },
    {
      _id: 'ENR003',
      name: 'Vinisha kalola',
      image: null,
      attendance: false
    },
    {
      _id: 'ENR004',
      name: 'Om Pawaskar',
      image: null,
      attendance: false
    },
    {
      _id: 'ENR005',
      name: 'Arpan Saha',
      image: null,
      attendance: false
    },
    {
      _id: 'ENR006',
      name: 'Anmol',
      image: null,
      attendance: false
    }
  ]);

  const [slotId, setSlotId] = useState('684487a829952bf5a3681af0');
  const [studentsPresent, setStudentsPresent] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const specialStudentNames = ['Vinisha kalola', 'Tharunika L', 'Anmol'];

  useEffect(() => {
    // API calls
    const fetchStudentsOfSlot = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/get-students-class-schedule/${slotId}`);
        console.log(res);
        setStudents(res.data || students);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudentsOfSlot();
  }, []);

  // API call
  const handleAttendanceChange = (studentId) => {
    if (studentsPresent.includes(studentId)) {
      setStudentsPresent(studentsPresent.filter(id => id !== studentId));
    } else {
      setStudentsPresent([...studentsPresent, studentId]);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/class-schedule/mark-attendance/${slotId}`, {
        studentsID: studentsPresent
      });
      console.log(response.data);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    }
  };

  const handleImageUpload = (studentId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudents(students.map(student =>
          student._id === studentId
            ? { ...student, image: e.target.result }
            : student
        ));
        
        // Mark the student as present when their image is uploaded
        if (!studentsPresent.includes(studentId)) {
          setStudentsPresent([...studentsPresent, studentId]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // For demo purposes, we'll use the student_photos/photo_01.jpg path
      setUploadedImage("/student_photos/photo_01.jpg");
      
      // Mark special students as present when class photo is uploaded
      const specialStudents = students.filter(student => 
        specialStudentNames.includes(student.name)
      );
      
      const specialStudentIds = specialStudents.map(student => student._id);
      
      // Add only the IDs that aren't already in the studentsPresent array
      const newStudentsPresent = [...studentsPresent];
      
      specialStudentIds.forEach(id => {
        if (!newStudentsPresent.includes(id)) {
          newStudentsPresent.push(id);
        }
      });
      
      setStudentsPresent(newStudentsPresent);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2" style={{ borderColor: 'rgba(247, 172, 45, 0.15)' }}>
          <div className="flex items-center mb-8">
            <div className="p-4 rounded-2xl mr-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)' }}>
              <Clock className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#003c64' }}>Student Attendance Dashboard</h1>
              <p className="text-lg" style={{ color: '#6b7280' }}>Track and manage student attendance with image verification</p>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mt-6 mb-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed" style={{ borderColor: 'rgba(247, 172, 45, 0.3)' }}>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#003c64' }}>Upload Class Photo</h3>
                <p className="text-sm text-gray-600">Upload a group photo for today's class</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center shadow-sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </button>
              </div>
            </div>
            
            {/* Display uploaded image */}
            {uploadedImage && (
              <div className="mt-6">
                <div className="rounded-lg overflow-hidden border-2" style={{ borderColor: '#e5e7eb', maxWidth: '300px', margin: '0 auto' }}>
                  <img
                    src={uploadedImage}
                    alt="Uploaded class photo"
                    className="w-full h-auto"
                  />
                </div>
                <div className="text-center mt-3">
                  <p className="text-sm font-medium text-green-600 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Class photo uploaded successfully!
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
                Date & Time
              </label>
              <input
                type="text"
                value={new Date().toLocaleString()}
                readOnly
                className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-lg font-medium bg-gray-50"
                style={{ borderColor: '#e5e7eb', color: '#003c64' }}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
                Slot ID
              </label>
              <input
                type="text"
                value="SLOT-001"
                readOnly
                className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-lg font-medium bg-gray-50"
                style={{ borderColor: '#e5e7eb', color: '#003c64' }}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
                Volunteer Name
              </label>
              <input
                type="text"
                value="Tharunika L"
                readOnly
                className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-lg font-medium bg-gray-50"
                style={{ borderColor: '#e5e7eb', color: '#003c64' }}
              />
            </div>
          </div>
        </div>
        
        {/* Table Header and Body */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2" style={{ borderColor: 'rgba(247, 172, 45, 0.15)' }}>
          <div className="px-8 py-6" style={{ background: 'linear-gradient(135deg, #003c64 0%, #0056a8 100%)' }}>
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Camera className="h-6 w-6 mr-3" />
              Student Attendance Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, rgba(247, 172, 45, 0.05) 100%)' }}>
                <tr style={{ borderBottom: '2px solid rgba(247, 172, 45, 0.2)' }}>
                  <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 flex items-center justify-center" style={{ color: '#f7ac2d' }}>👤</span>
                      Student Name
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center justify-center">
                      <Camera className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
                      Image
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center justify-center">
                      <span className="w-4 h-4 mr-2 flex items-center justify-center" style={{ color: '#10b981' }}>✓</span>
                      Is Present
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center justify-center">
                      <Upload className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
                      Upload Image
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  // Check if this student should be marked present
                  const isSpecialStudent = specialStudentNames.includes(student.name);
                  
                  return (
                    <tr
                      key={student._id}
                      className="transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                        borderBottom: '1px solid #e5e7eb'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(247, 172, 45, 0.03)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <td className="px-8 py-6">
                        <span className="text-lg font-medium" style={{ color: '#374151' }}>{student.name}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          {(isSpecialStudent && uploadedImage) ? (
                            <img
                              src={uploadedImage}
                              alt={student.name}
                              className="h-12 w-12 rounded-full object-cover border-2 shadow-sm"
                              style={{ borderColor: '#e5e7eb' }}
                            />
                          ) : student.image ? (
                            <img
                              src={student.image}
                              alt={student.name}
                              className="h-12 w-12 rounded-full object-cover border-2 shadow-sm"
                              style={{ borderColor: '#e5e7eb' }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200">
                              <Camera className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={studentsPresent.includes(student._id)}
                              onChange={() => handleAttendanceChange(student._id)}
                              className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                            />
                          </label>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          <label className="cursor-pointer px-6 py-3 rounded-xl transition-all duration-200 flex items-center font-medium shadow-sm hover:shadow-md"
                            style={{
                              backgroundColor: (student.image || (isSpecialStudent && uploadedImage)) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(247, 172, 45, 0.1)',
                              color: (student.image || (isSpecialStudent && uploadedImage)) ? '#10b981' : '#f7ac2d',
                              border: `2px solid ${(student.image || (isSpecialStudent && uploadedImage)) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(247, 172, 45, 0.2)'}`
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = (student.image || (isSpecialStudent && uploadedImage)) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(247, 172, 45, 0.15)';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = (student.image || (isSpecialStudent && uploadedImage)) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(247, 172, 45, 0.1)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {(student.image || (isSpecialStudent && uploadedImage)) ? 'Change Image' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(student._id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="text-xl">✅</div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-green-600">
                  {studentsPresent.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Present
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <div className="text-xl">❌</div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-red-600">
                  {students.length - studentsPresent.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Absent
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="text-xl">👥</div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-blue-600">
                  {students.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Students
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
            Export Data
          </button>
          <button onClick={handleSaveAttendance} className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTest;