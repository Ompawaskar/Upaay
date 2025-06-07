// import React, { useState } from 'react';
// import { 
//   GraduationCap, 
//   Calendar, 
//   Target, 
//   Save, 
//   Upload, 
//   CheckCircle, 
//   Clock, 
//   Users, 
//   FileText,
//   Award,
//   User
// } from 'lucide-react';

// const VolunteerGradingComponent = () => {
//   const [students, setStudents] = useState([
//     { id: 1, name: 'Aarav Sharma', rollNo: 'STD001', marks: '', file: null },
//     { id: 2, name: 'Priya Patel', rollNo: 'STD002', marks: '', file: null },
//     { id: 3, name: 'Rohit Kumar', rollNo: 'STD003', marks: '', file: null },
//     { id: 4, name: 'Sneha Singh', rollNo: 'STD004', marks: '', file: null },
//     { id: 5, name: 'Arjun Gupta', rollNo: 'STD005', marks: '', file: null },
//     { id: 6, name: 'Kavya Reddy', rollNo: 'STD006', marks: '', file: null },
//     { id: 7, name: 'Vikram Joshi', rollNo: 'STD007', marks: '', file: null },
//     { id: 8, name: 'Ananya Mehta', rollNo: 'STD008', marks: '', file: null },
//     { id: 9, name: 'Rahul Verma', rollNo: 'STD009', marks: '', file: null },
//     { id: 10, name: 'Diya Agarwal', rollNo: 'STD010', marks: '', file: null }
//   ]);

//   const [subject, setSubject] = useState('Mathematics');
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//   const [maxMarks, setMaxMarks] = useState(20);

//   const handleMarksChange = (id, marks) => {
//     const numericMarks = marks === '' ? '' : Math.min(Math.max(0, parseInt(marks) || 0), maxMarks);
//     setStudents(prev => prev.map(student =>
//       student.id === id ? { ...student, marks: numericMarks } : student
//     ));
//   };

//   const handleFileUpload = (id, file) => {
//     setStudents(prev => prev.map(student =>
//       student.id === id ? { ...student, file } : student
//     ));
//   };

//   const handleSave = () => {
//     const gradedStudents = students.filter(s => s.marks !== '');
//     console.log('Saving data:', { subject, date, maxMarks, students: gradedStudents });
//     alert(`Successfully saved grades for ${gradedStudents.length} students!`);
//   };

//   const gradedCount = students.filter(s => s.marks !== '').length;
//   const totalStudents = students.length;
//   const progress = (gradedCount / totalStudents) * 100;

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header Card */}
//         <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2" style={{ borderColor: 'rgba(247, 172, 45, 0.15)' }}>
//           <div className="flex items-center mb-8">
//             <div className="p-4 rounded-2xl mr-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)' }}>
//               <GraduationCap className="h-10 w-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold mb-2" style={{ color: '#003c64' }}>Volunteer Grading Portal</h1>
//               <p className="text-lg" style={{ color: '#6b7280' }}>Grade student assignments with ease and efficiency</p>
//             </div>
//           </div>

//           {/* Enhanced Progress Section */}
//           <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6 mb-8 border" style={{ borderColor: 'rgba(247, 172, 45, 0.2)' }}>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center">
//                 <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(247, 172, 45, 0.2)' }}>
//                   <Users className="h-5 w-5" style={{ color: '#f7ac2d' }} />
//                 </div>
//                 <span className="text-lg font-semibold" style={{ color: '#003c64' }}>Grading Progress</span>
//               </div>
//               <div className="text-right">
//                 <div className="text-2xl font-bold" style={{ color: '#003c64' }}>{gradedCount}/{totalStudents}</div>
//                 <div className="text-sm" style={{ color: '#6b7280' }}>students graded</div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex-1">
//                 <div className="w-full rounded-full h-4" style={{ backgroundColor: '#e5e7eb' }}>
//                   <div 
//                     className="h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
//                     style={{ 
//                       width: `${progress}%`,
//                       background: 'linear-gradient(90deg, #f7ac2d 0%, #ffb84d 100%)'
//                     }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="text-lg font-bold" style={{ color: '#f7ac2d' }}>
//                 {Math.round(progress)}%
//               </div>
//             </div>
//           </div>

//           {/* Form Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="space-y-3">
//               <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
//                 <FileText className="h-5 w-5 mr-2" style={{ color: '#f7ac2d' }} />
//                 Subject
//               </label>
//               <input
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg font-medium"
//                 style={{ 
//                   borderColor: '#e5e7eb',
//                   color: '#003c64',
//                   backgroundColor: '#f9fafb'
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#f7ac2d';
//                   e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
//                   e.target.style.backgroundColor = 'white';
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e5e7eb';
//                   e.target.style.boxShadow = 'none';
//                   e.target.style.backgroundColor = '#f9fafb';
//                 }}
//                 placeholder="Enter subject name"
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
//                 <Calendar className="h-5 w-5 mr-2" style={{ color: '#f7ac2d' }} />
//                 Date
//               </label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg font-medium"
//                 style={{ 
//                   borderColor: '#e5e7eb',
//                   color: '#003c64',
//                   backgroundColor: '#f9fafb'
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#f7ac2d';
//                   e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
//                   e.target.style.backgroundColor = 'white';
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e5e7eb';
//                   e.target.style.boxShadow = 'none';
//                   e.target.style.backgroundColor = '#f9fafb';
//                 }}
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
//                 <Target className="h-5 w-5 mr-2" style={{ color: '#f7ac2d' }} />
//                 Maximum Marks
//               </label>
//               <input
//                 type="number"
//                 value={maxMarks}
//                 onChange={(e) => setMaxMarks(Math.max(1, parseInt(e.target.value) || 1))}
//                 min="1"
//                 max="100"
//                 className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg font-medium"
//                 style={{ 
//                   borderColor: '#e5e7eb',
//                   color: '#003c64',
//                   backgroundColor: '#f9fafb'
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#f7ac2d';
//                   e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
//                   e.target.style.backgroundColor = 'white';
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e5e7eb';
//                   e.target.style.boxShadow = 'none';
//                   e.target.style.backgroundColor = '#f9fafb';
//                 }}
//                 placeholder="Maximum marks"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-xl transition-all duration-300" style={{ borderColor: 'rgba(34, 197, 94, 0.2)' }}>
//             <div className="flex items-center">
//               <div className="p-4 rounded-2xl mr-4 shadow-md" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
//                 <CheckCircle className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <p className="text-3xl font-bold mb-1" style={{ color: '#003c64' }}>{gradedCount}</p>
//                 <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Students Graded</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-xl transition-all duration-300" style={{ borderColor: 'rgba(247, 172, 45, 0.2)' }}>
//             <div className="flex items-center">
//               <div className="p-4 rounded-2xl mr-4 shadow-md" style={{ background: 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)' }}>
//                 <Clock className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <p className="text-3xl font-bold mb-1" style={{ color: '#003c64' }}>{totalStudents - gradedCount}</p>
//                 <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Pending Review</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-xl transition-all duration-300" style={{ borderColor: 'rgba(0, 60, 100, 0.2)' }}>
//             <div className="flex items-center">
//               <div className="p-4 rounded-2xl mr-4 shadow-md" style={{ background: 'linear-gradient(135deg, #003c64 0%, #0056a8 100%)' }}>
//                 <Award className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <p className="text-3xl font-bold mb-1" style={{ color: '#003c64' }}>{Math.round(progress)}%</p>
//                 <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Completion Rate</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Students Table */}
//         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2" style={{ borderColor: 'rgba(247, 172, 45, 0.15)' }}>
//           <div className="px-8 py-6" style={{ background: 'linear-gradient(135deg, #003c64 0%, #0056a8 100%)' }}>
//             <h3 className="text-2xl font-bold text-white flex items-center">
//               <Users className="h-6 w-6 mr-3" />
//               Student Grading Dashboard
//             </h3>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, rgba(247, 172, 45, 0.05) 100%)' }}>
//                 <tr style={{ borderBottom: '2px solid rgba(247, 172, 45, 0.2)' }}>
//                   <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
//                     <div className="flex items-center">
//                       <FileText className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
//                       Roll Number
//                     </div>
//                   </th>
//                   <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
//                     <div className="flex items-center">
//                       <User className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
//                       Student Name
//                     </div>
//                   </th>
//                   <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
//                     <div className="flex items-center justify-center">
//                       <Target className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
//                       Marks / {maxMarks}
//                     </div>
//                   </th>
//                   <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
//                     <div className="flex items-center justify-center">
//                       <Upload className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
//                       Assignment Image
//                     </div>
//                   </th>
//                   <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((student, index) => (
//                   <tr 
//                     key={student.id} 
//                     className="transition-all duration-200 hover:shadow-md"
//                     style={{ 
//                       backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
//                       borderBottom: '1px solid #e5e7eb'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = 'rgba(247, 172, 45, 0.03)';
//                       e.currentTarget.style.transform = 'translateX(4px)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafbfc';
//                       e.currentTarget.style.transform = 'translateX(0)';
//                     }}
//                   >
//                     <td className="px-8 py-6">
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: student.marks !== '' ? '#10b981' : '#e5e7eb' }}></div>
//                         <span className="font-bold text-lg" style={{ color: '#003c64' }}>{student.rollNo}</span>
//                       </div>
//                     </td>
//                     <td className="px-8 py-6">
//                       <span className="text-lg font-medium" style={{ color: '#374151' }}>{student.name}</span>
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <div className="flex justify-center">
//                         <input
//                           type="number"
//                           min="0"
//                           max={maxMarks}
//                           value={student.marks}
//                           onChange={(e) => handleMarksChange(student.id, e.target.value)}
//                           className="w-28 text-center border-2 rounded-xl px-4 py-3 transition-all duration-200 text-lg font-bold shadow-sm"
//                           style={{ 
//                             borderColor: student.marks !== '' ? '#10b981' : '#e5e7eb',
//                             color: '#003c64',
//                             backgroundColor: student.marks !== '' ? '#f0fdf4' : '#f9fafb'
//                           }}
//                           onFocus={(e) => {
//                             e.target.style.borderColor = '#f7ac2d';
//                             e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
//                             e.target.style.backgroundColor = 'white';
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.borderColor = student.marks !== '' ? '#10b981' : '#e5e7eb';
//                             e.target.style.boxShadow = 'none';
//                             e.target.style.backgroundColor = student.marks !== '' ? '#f0fdf4' : '#f9fafb';
//                           }}
//                           placeholder="0"
//                         />
//                       </div>
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <div className="flex flex-col items-center">
//                         <label 
//                           className="cursor-pointer px-6 py-3 rounded-xl transition-all duration-200 flex items-center font-medium shadow-sm hover:shadow-md"
//                           style={{ 
//                             backgroundColor: student.file ? 'rgba(16, 185, 129, 0.1)' : 'rgba(247, 172, 45, 0.1)',
//                             color: student.file ? '#10b981' : '#f7ac2d',
//                             border: `2px solid ${student.file ? 'rgba(16, 185, 129, 0.2)' : 'rgba(247, 172, 45, 0.2)'}`
//                           }}
//                           onMouseEnter={(e) => {
//                             e.target.style.backgroundColor = student.file ? 'rgba(16, 185, 129, 0.15)' : 'rgba(247, 172, 45, 0.15)';
//                             e.target.style.transform = 'translateY(-1px)';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.target.style.backgroundColor = student.file ? 'rgba(16, 185, 129, 0.1)' : 'rgba(247, 172, 45, 0.1)';
//                             e.target.style.transform = 'translateY(0)';
//                           }}
//                         >
//                           <Upload className="h-4 w-4 mr-2" />
//                           {student.file ? 'Change Image' : 'Upload Image'}
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => handleFileUpload(student.id, e.target.files[0])}
//                             className="hidden"
//                           />
//                         </label>
//                         {student.file && (
//                           <p className="text-xs mt-2 px-2 py-1 rounded-md" style={{ color: '#6b7280', backgroundColor: '#f3f4f6' }}>
//                             {student.file.name}
//                           </p>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       {student.marks !== '' ? (
//                         <div className="flex items-center justify-center px-3 py-2 rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
//                           <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
//                           <span className="text-green-600 font-bold text-sm">GRADED</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center px-3 py-2 rounded-full" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)' }}>
//                           <Clock className="h-5 w-5 mr-2" style={{ color: '#9ca3af' }} />
//                           <span className="text-sm font-medium" style={{ color: '#9ca3af' }}>PENDING</span>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="mt-10 flex justify-center">
//           <button
//             onClick={handleSave}
//             disabled={gradedCount === 0}
//             className={`px-12 py-5 font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center text-lg ${
//               gradedCount === 0 
//                 ? 'cursor-not-allowed opacity-50' 
//                 : 'hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105'
//             }`}
//             style={{
//               background: gradedCount === 0 
//                 ? '#e5e7eb' 
//                 : 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)',
//               color: gradedCount === 0 ? '#9ca3af' : 'white'
//             }}
//             onMouseEnter={(e) => {
//               if (gradedCount > 0) {
//                 e.target.style.background = 'linear-gradient(135deg, #e6a024 0%, #f7ac2d 100%)';
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (gradedCount > 0) {
//                 e.target.style.background = 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)';
//               }
//             }}
//           >
//             <Save className="h-6 w-6 mr-3" />
//             Save All Grades • {gradedCount} Students
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VolunteerGradingComponent;