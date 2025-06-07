import React, { useState } from 'react';
import { Upload, Camera, Clock } from 'lucide-react';

const AttendanceTest = () => {
  // Sample student data - you can replace this with actual data from your backend
  const [students, setStudents] = useState([
    {
      id: 1,
      enrollmentId: 'ENR001',
      name: 'Tharunika L',
      photo: null,
      attendance: false
    },
    {
      id: 2,
      enrollmentId: 'ENR002',
      name: 'Gouri Varma',
      photo: null,
      attendance: false
    },
    {
      id: 3,
      enrollmentId: 'ENR003',
      name: 'Vinisha kalola',
      photo: null,
      attendance: false
    },
    {
      id: 4,
      enrollmentId: 'ENR004',
      name: 'Om Pawaskar',
      photo: null,
      attendance: false
    },
    {
      id: 5,
      enrollmentId: 'ENR005',
      name: 'Arpan Saha',
      photo: null,
      attendance: false
    }
  ]);

  const handleAttendanceChange = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, attendance: !student.attendance }
        : student
    ));
  };

  const handlePhotoUpload = (studentId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudents(students.map(student =>
          student.id === studentId
            ? { ...student, photo: e.target.result }
            : student
        ));
      };
      reader.readAsDataURL(file);
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
              <p className="text-lg" style={{ color: '#6b7280' }}>Track and manage student attendance with photo verification</p>
            </div>
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
                      <span className="w-4 h-4 mr-2 flex items-center justify-center" style={{ color: '#f7ac2d' }}>#</span>
                      Enrollment ID
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 flex items-center justify-center" style={{ color: '#f7ac2d' }}>👤</span>
                      Student Name
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center justify-center">
                      <Camera className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
                      Photo
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
                      Upload Photo
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.id}
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
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: student.attendance ? '#10b981' : '#e5e7eb' }}></div>
                        <span className="font-bold text-lg" style={{ color: '#003c64' }}>{student.enrollmentId}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-medium" style={{ color: '#374151' }}>{student.name}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        {student.photo ? (
                          <img
                            src={student.photo}
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
                            checked={student.attendance}
                            onChange={() => handleAttendanceChange(student.id)}
                            className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                          />
                        </label>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        <label className="cursor-pointer px-6 py-3 rounded-xl transition-all duration-200 flex items-center font-medium shadow-sm hover:shadow-md"
                          style={{
                            backgroundColor: student.photo ? 'rgba(16, 185, 129, 0.1)' : 'rgba(247, 172, 45, 0.1)',
                            color: student.photo ? '#10b981' : '#f7ac2d',
                            border: `2px solid ${student.photo ? 'rgba(16, 185, 129, 0.2)' : 'rgba(247, 172, 45, 0.2)'}`
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = student.photo ? 'rgba(16, 185, 129, 0.15)' : 'rgba(247, 172, 45, 0.15)';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = student.photo ? 'rgba(16, 185, 129, 0.1)' : 'rgba(247, 172, 45, 0.1)';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {student.photo ? 'Change Image' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(student.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
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
                  {students.filter(s => s.attendance).length}
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
                  {students.filter(s => !s.attendance).length}
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
          <button className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTest;