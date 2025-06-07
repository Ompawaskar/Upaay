import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Target, 
  Save, 
  Upload, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText,
  Award,
  User,
  Eye
} from 'lucide-react';

const VolunteerGradingComponent = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Aarav Sharma', rollNo: 'STD001', marks: '', file: null },
    { id: 2, name: 'Priya Patel', rollNo: 'STD002', marks: '', file: null },
    { id: 3, name: 'Rohit Kumar', rollNo: 'STD003', marks: '', file: null },
    { id: 4, name: 'Sneha Singh', rollNo: 'STD004', marks: '', file: null },
    { id: 5, name: 'Arjun Gupta', rollNo: 'STD005', marks: '', file: null },
    { id: 6, name: 'Kavya Reddy', rollNo: 'STD006', marks: '', file: null },
    { id: 7, name: 'Vikram Joshi', rollNo: 'STD007', marks: '', file: null },
    { id: 8, name: 'Ananya Mehta', rollNo: 'STD008', marks: '', file: null },
    { id: 9, name: 'Rahul Verma', rollNo: 'STD009', marks: '', file: null },
    { id: 10, name: 'Diya Agarwal', rollNo: 'STD010', marks: '', file: null }
  ]);

  const [subject, setSubject] = useState('Mathematics');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxMarks, setMaxMarks] = useState(20);
  const [ocrStatus, setOcrStatus] = useState({});
  const [centerLocation, setCenterLocation] = useState('Main Center');
  const [ocrProcessingMessage, setOcrProcessingMessage] = useState('');

  useEffect(() => {
    // Fetch real students from the backend
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/students');
        
        if (response.ok) {
          const data = await response.json();
          
          // Map the student data to match your component's state structure
          const mappedStudents = data.map((student, index) => ({
            id: index + 1,
            name: student.name,
            rollNo: student.rollNo,
            marks: '',
            file: null,
            dbId: student._id // Store the MongoDB _id for reference
          }));
          
          setStudents(mappedStudents);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    
    fetchStudents();
  }, []);

  const handleMarksChange = (id, marks) => {
    const numericMarks = marks === '' ? '' : Math.min(Math.max(0, parseInt(marks) || 0), maxMarks);
    setStudents(prev => prev.map(student =>
      student.id === id ? { ...student, marks: numericMarks } : student
    ));
  };

  const handleFileUpload = async (id, file) => {
    if (!file) return;
    
    // Update student file immediately for UI feedback
    setStudents(prev => prev.map(student =>
      student.id === id ? { ...student, file, ocrProcessing: true } : student
    ));
    
    // Set OCR processing status
    setOcrStatus(prev => ({ ...prev, [id]: 'processing' }));
    setOcrProcessingMessage('Analyzing image with OCR...');
    
    try {
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('testImage', file);
      formData.append('studentId', students.find(s => s.id === id).rollNo);
      
      // Call the backend OCR endpoint
      const response = await fetch('http://localhost:3000/api/ocr/process-test', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('OCR processing failed');
      
      const data = await response.json();
      
      if (data.success) {
        // Auto-fill form fields with detected data
        if (data.subjectName) setSubject(data.subjectName);
        if (data.testDate) setDate(data.testDate);
        if (data.maxMarks) setMaxMarks(data.maxMarks);
        
        // Auto-fill marks if detected
        if (data.marksReceived) {
          const marksToSet = Math.min(data.marksReceived, maxMarks);
          setStudents(prev => prev.map(student =>
            student.id === id ? { 
              ...student, 
              ocrProcessing: false,
              marks: marksToSet,
              ocrData: data
            } : student
          ));
          
          setOcrProcessingMessage(`Successfully detected marks: ${marksToSet}`);
        } else {
          setStudents(prev => prev.map(student =>
            student.id === id ? { 
              ...student, 
              ocrProcessing: false,
              ocrData: data
            } : student
          ));
          
          setOcrProcessingMessage('OCR completed, but no marks detected. Please enter manually.');
        }
        setOcrStatus(prev => ({ ...prev, [id]: 'success' }));
        
        // Auto-clear message after 5 seconds
        setTimeout(() => {
          setOcrProcessingMessage('');
        }, 5000);
      } else {
        setOcrStatus(prev => ({ ...prev, [id]: 'error' }));
        setOcrProcessingMessage('Error processing image. Please try again or enter marks manually.');
        setStudents(prev => prev.map(student =>
          student.id === id ? { ...student, ocrProcessing: false } : student
        ));
      }
    } catch (error) {
      console.error("Error processing file with OCR:", error);
      setOcrStatus(prev => ({ ...prev, [id]: 'error' }));
      setOcrProcessingMessage('Error processing image. Please try again.');
      setStudents(prev => prev.map(student =>
        student.id === id ? { ...student, ocrProcessing: false } : student
      ));
    }
  };
  
  const handleSave = async () => {
    const gradedStudents = students.filter(s => s.marks !== '');
    
    if (gradedStudents.length === 0) {
      alert('Please grade at least one student before saving.');
      return;
    }
    
    try {
      // In a real app, you'd get this from authentication
      const volunteerId = "650a7d5f12e3456789abcdef"; // Example MongoDB ObjectId format
      
      // First, upload all the image files to get permanent URLs
      const studentResultsWithImages = await Promise.all(
        gradedStudents.map(async (student) => {
          let submissionImageUrl = '';
          
          if (student.file) {
            // Create a FormData object to upload the file
            const formData = new FormData();
            formData.append('testImage', student.file);
            formData.append('studentId', student.rollNo);
            formData.append('testSubject', subject);
            
            // Upload the file and get a permanent URL
            const uploadResponse = await fetch('http://localhost:3000/api/tests/upload-image', {
              method: 'POST',
              body: formData,
            });
            
            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              submissionImageUrl = uploadData.imageUrl;
            }
          }
          
          return {
            rollNo: student.rollNo,
            name: student.name,
            marks: parseInt(student.marks),
            imageUrl: submissionImageUrl,
            ocrData: student.ocrData || null
          };
        })
      );

      // Now save the test and student records
      const testData = {
        subject,
        date: new Date(date),
        centerLocation,
        maxMarks: parseInt(maxMarks),
        imageLink: "" // Optional
      };
      
      const response = await fetch('http://localhost:3000/api/students/save-test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testData,
          studentResults: studentResultsWithImages,
          volunteerId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOcrProcessingMessage(`✓ Successfully saved grades for ${gradedStudents.length} students!`);
        setTimeout(() => setOcrProcessingMessage(''), 3000);
        
        // Reset the form for the next batch or keep it for reference
        // Uncomment to reset: setStudents(students.map(s => ({...s, marks: '', file: null})));
      } else {
        setOcrProcessingMessage(`Error saving grades: ${data.message}`);
        setTimeout(() => setOcrProcessingMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      setOcrProcessingMessage('Failed to save grades. Please try again later.');
      setTimeout(() => setOcrProcessingMessage(''), 5000);
    }
  };
  
  const gradedCount = students.filter(s => s.marks !== '').length;
  const totalStudents = students.length;
  const progress = (gradedCount / totalStudents) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2" style={{ borderColor: 'rgba(247, 172, 45, 0.15)' }}>
          <div className="flex items-center mb-8">
            <div className="p-4 rounded-2xl mr-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)' }}>
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#003c64' }}>Volunteer Grading Portal</h1>
              <p className="text-lg" style={{ color: '#6b7280' }}>Grade student assignments with ease and efficiency</p>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6 mb-8 border" style={{ borderColor: 'rgba(247, 172, 45, 0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(247, 172, 45, 0.2)' }}>
                  <Users className="h-5 w-5" style={{ color: '#f7ac2d' }} />
                </div>
                <span className="text-lg font-semibold" style={{ color: '#003c64' }}>Grading Progress</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: '#003c64' }}>{gradedCount}/{totalStudents}</div>
                <div className="text-sm" style={{ color: '#6b7280' }}>students graded</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full rounded-full h-4" style={{ backgroundColor: '#e5e7eb' }}>
                  <div 
                    className="h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ 
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #f7ac2d 0%, #ffb84d 100%)'
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-lg font-bold" style={{ color: '#f7ac2d' }}>
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
                <FileText className="h-5 w-5 mr-2" style={{ color: '#f7ac2d' }} />
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg font-medium"
                style={{ 
                  borderColor: '#e5e7eb',
                  color: '#003c64',
                  backgroundColor: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f7ac2d';
                  e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
                placeholder="Enter subject name"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
                <Calendar className="h-5 w-5 mr-2" style={{ color: '#f7ac2d' }} />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg font-medium"
                style={{ 
                  borderColor: '#e5e7eb',
                  color: '#003c64',
                  backgroundColor: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f7ac2d';
                  e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
                <Users className="h-5 w-5 mr-2" style={{ color: '#f7ac2d' }} />
                Center Location
              </label>
              <input
                type="text"
                value={centerLocation}
                onChange={(e) => setCenterLocation(e.target.value)}
                className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg font-medium"
                style={{ 
                  borderColor: '#e5e7eb',
                  color: '#003c64',
                  backgroundColor: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f7ac2d';
                  e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
                placeholder="Enter center location"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-sm font-semibold" style={{ color: '#003c64' }}>
                <Target className="h-5 w-5 mr-2" style={{ color: '#f7ac2d' }} />
                Maximum Marks
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="100"
                className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 text-lg font-medium"
                style={{ 
                  borderColor: '#e5e7eb',
                  color: '#003c64',
                  backgroundColor: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f7ac2d';
                  e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
                placeholder="Maximum marks"
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-xl transition-all duration-300" style={{ borderColor: 'rgba(34, 197, 94, 0.2)' }}>
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 shadow-md" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1" style={{ color: '#003c64' }}>{gradedCount}</p>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Students Graded</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-xl transition-all duration-300" style={{ borderColor: 'rgba(247, 172, 45, 0.2)' }}>
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 shadow-md" style={{ background: 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)' }}>
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1" style={{ color: '#003c64' }}>{totalStudents - gradedCount}</p>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Pending Review</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 hover:shadow-xl transition-all duration-300" style={{ borderColor: 'rgba(0, 60, 100, 0.2)' }}>
            <div className="flex items-center">
              <div className="p-4 rounded-2xl mr-4 shadow-md" style={{ background: 'linear-gradient(135deg, #003c64 0%, #0056a8 100%)' }}>
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1" style={{ color: '#003c64' }}>{Math.round(progress)}%</p>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2" style={{ borderColor: 'rgba(247, 172, 45, 0.15)' }}>
          <div className="px-8 py-6" style={{ background: 'linear-gradient(135deg, #003c64 0%, #0056a8 100%)' }}>
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Users className="h-6 w-6 mr-3" />
              Student Grading Dashboard
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, rgba(247, 172, 45, 0.05) 100%)' }}>
                <tr style={{ borderBottom: '2px solid rgba(247, 172, 45, 0.2)' }}>
                  <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
                      Roll Number
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
                      Student Name
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center justify-center">
                      <Target className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
                      Marks / {maxMarks}
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>
                    <div className="flex items-center justify-center">
                      <Upload className="h-4 w-4 mr-2" style={{ color: '#f7ac2d' }} />
                      Assignment Image
                    </div>
                  </th>
                  <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wide" style={{ color: '#003c64' }}>Status</th>
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
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: student.marks !== '' ? '#10b981' : '#e5e7eb' }}></div>
                        <span className="font-bold text-lg" style={{ color: '#003c64' }}>{student.rollNo}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-medium" style={{ color: '#374151' }}>{student.name}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={student.marks}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          className="w-28 text-center border-2 rounded-xl px-4 py-3 transition-all duration-200 text-lg font-bold shadow-sm"
                          style={{ 
                            borderColor: student.marks !== '' ? '#10b981' : '#e5e7eb',
                            color: '#003c64',
                            backgroundColor: student.marks !== '' ? '#f0fdf4' : '#f9fafb'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#f7ac2d';
                            e.target.style.boxShadow = '0 0 0 3px rgba(247, 172, 45, 0.1)';
                            e.target.style.backgroundColor = 'white';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = student.marks !== '' ? '#10b981' : '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                            e.target.style.backgroundColor = student.marks !== '' ? '#f0fdf4' : '#f9fafb';
                          }}
                          placeholder="0"
                        />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <label 
                          className="cursor-pointer px-6 py-3 rounded-xl transition-all duration-200 flex items-center font-medium shadow-sm hover:shadow-md"
                          style={{ 
                            backgroundColor: student.file ? 
                              ocrStatus[student.id] === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                              ocrStatus[student.id] === 'error' ? 'rgba(239, 68, 68, 0.1)' : 
                              'rgba(247, 172, 45, 0.1)' : 
                              'rgba(247, 172, 45, 0.1)',
                            color: student.file ? 
                              ocrStatus[student.id] === 'success' ? '#10b981' :
                              ocrStatus[student.id] === 'error' ? '#ef4444' : 
                              '#f7ac2d' : 
                              '#f7ac2d',
                            border: `2px solid ${student.file ? 
                              ocrStatus[student.id] === 'success' ? 'rgba(16, 185, 129, 0.2)' :
                              ocrStatus[student.id] === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                              'rgba(247, 172, 45, 0.2)' : 
                              'rgba(247, 172, 45, 0.2)'}`
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = student.file ? 
                              ocrStatus[student.id] === 'success' ? 'rgba(16, 185, 129, 0.15)' :
                              ocrStatus[student.id] === 'error' ? 'rgba(239, 68, 68, 0.15)' :
                              'rgba(247, 172, 45, 0.15)' : 
                              'rgba(247, 172, 45, 0.15)';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = student.file ? 
                              ocrStatus[student.id] === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                              ocrStatus[student.id] === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                              'rgba(247, 172, 45, 0.1)' : 
                              'rgba(247, 172, 45, 0.1)';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          {ocrStatus[student.id] === 'processing' ? (
                            <div className="animate-pulse flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Processing...
                            </div>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              {student.file ? 'Change Image' : 'Upload Image'}
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(student.id, e.target.files[0])}
                            className="hidden"
                            disabled={ocrStatus[student.id] === 'processing'}
                          />
                        </label>
                        {student.file && (
                          <div className="mt-2 flex flex-col items-center">
                            <p className="text-xs px-2 py-1 rounded-md" style={{ color: '#6b7280', backgroundColor: '#f3f4f6' }}>
                              {student.file.name}
                            </p>
                            {student.ocrData && (
                              <div className="mt-1 flex flex-col items-center">
                                <button 
                                  className="text-xs px-2 py-1 rounded-md flex items-center"
                                  style={{ color: '#0056a8', backgroundColor: 'rgba(0, 86, 168, 0.1)' }}
                                  onClick={() => {
                                    const ocrInfo = student.ocrData;
                                    const messageLines = [
                                      `Student: ${ocrInfo.studentName || 'Not detected'}`,
                                      `Subject: ${ocrInfo.subjectName || 'Not detected'}`,
                                      `Date: ${ocrInfo.testDate || 'Not detected'}`,
                                      `Marks: ${ocrInfo.marksReceived || '0'}/${ocrInfo.maxMarks || maxMarks}`,
                                      `Confidence: ${Math.round(ocrInfo.confidence || 0)}%`
                                    ];
                                    alert(messageLines.join('\n'));
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View OCR Data
                                </button>
                                
                                {student.ocrData.imageUrl && (
                                  <a 
                                    href={`http://localhost:3000${student.ocrData.imageUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 text-xs px-2 py-1 rounded-md flex items-center"
                                    style={{ color: '#f7ac2d', backgroundColor: 'rgba(247, 172, 45, 0.1)' }}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Image
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {student.marks !== '' ? (
                        <div className="flex items-center justify-center px-3 py-2 rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-600 font-bold text-sm">GRADED</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center px-3 py-2 rounded-full" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)' }}>
                          <Clock className="h-5 w-5 mr-2" style={{ color: '#9ca3af' }} />
                          <span className="text-sm font-medium" style={{ color: '#9ca3af' }}>PENDING</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSave}
            disabled={gradedCount === 0}
            className={`px-12 py-5 font-bold rounded-2xl shadow-xl transition-all duration-300 flex items-center text-lg ${
              gradedCount === 0 
                ? 'cursor-not-allowed opacity-50' 
                : 'hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105'
            }`}
            style={{
              background: gradedCount === 0 
                ? '#e5e7eb' 
                : 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)',
              color: gradedCount === 0 ? '#9ca3af' : 'white'
            }}
            onMouseEnter={(e) => {
              if (gradedCount > 0) {
                e.target.style.background = 'linear-gradient(135deg, #e6a024 0%, #f7ac2d 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (gradedCount > 0) {
                e.target.style.background = 'linear-gradient(135deg, #f7ac2d 0%, #ffb84d 100%)';
              }
            }}
          >
            <Save className="h-6 w-6 mr-3" />
            Save All Grades • {gradedCount} Students
          </button>
        </div>
      </div>

      {/* Add OCR processing message notification */}
      {ocrProcessingMessage && (
        <div className="fixed top-8 right-8 max-w-md px-6 py-3 rounded-xl shadow-lg transition-all duration-500 animate-fadeIn z-50"
          style={{ 
            backgroundColor: ocrStatus[Object.keys(ocrStatus)[0]] === 'success' ? 'rgba(16, 185, 129, 0.95)' :
              ocrStatus[Object.keys(ocrStatus)[0]] === 'error' ? 'rgba(239, 68, 68, 0.95)' : 
              'rgba(247, 172, 45, 0.95)',
            color: 'white'
          }}
        >
          <p className="font-medium">{ocrProcessingMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerGradingComponent;