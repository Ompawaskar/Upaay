import React, { useState } from 'react';
import { Search, User, Users, Building, BarChart3, TrendingUp, Calendar, PieChart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [searchId, setSearchId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  // Sample data
  const studentsData = {
    'S001': {
      id: 'S001',
      name: 'Arjun Patel',
      age: 16,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Mumbai, Maharashtra',
      level: 4,
      feedback: 'Good in Mathematics, needs improvement in English grammar',
      attendance: {
        Mathematics: [85, 90, 88, 92, 87, 91, 89, 93, 86, 90, 88, 85],
        English: [78, 82, 80, 85, 83, 87, 84, 88, 81, 86, 84, 82],
        'Regional Language': [92, 95, 93, 96, 94, 97, 95, 98, 93, 96, 94, 92]
      },
      marks: {
        Mathematics: [78, 85, 82, 88, 91, 87, 89, 92, 85, 88, 90, 86],
        English: [65, 70, 68, 75, 72, 78, 76, 80, 73, 77, 79, 74],
        'Regional Language': [88, 92, 90, 94, 91, 95, 93, 96, 89, 93, 95, 91]
      }
    },
    'S002': {
      id: 'S002',
      name: 'Priya Sharma',
      age: 15,
      image: 'https://images.unsplash.com/photo-1494790108755-2616c0763c8b?w=150&h=150&fit=crop&crop=face',
      location: 'Pune, Maharashtra',
      level: 3,
      feedback: 'Excellent in Regional Language, good progress in Mathematics',
      attendance: {
        Mathematics: [82, 88, 85, 89, 84, 87, 86, 90, 83, 88, 85, 82],
        English: [90, 93, 91, 95, 92, 96, 94, 97, 90, 94, 92, 89],
        'Regional Language': [95, 98, 96, 99, 97, 100, 98, 99, 95, 98, 96, 94]
      },
      marks: {
        Mathematics: [72, 78, 75, 82, 79, 85, 83, 87, 76, 81, 84, 80],
        English: [85, 89, 87, 92, 90, 94, 92, 95, 88, 91, 93, 89],
        'Regional Language': [92, 96, 94, 98, 95, 99, 97, 100, 93, 97, 99, 95]
      }
    }
  };

  const volunteersData = {
    'V001': {
      id: 'V001',
      name: 'Dr. Rajesh Kumar',
      age: 35,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Mumbai, Maharashtra',
      expertIn: 'Mathematics',
      feedback: 'Excellent teaching methodology, students show great improvement',
      attendance: {
        Mathematics: [95, 98, 96, 99, 97, 100, 98, 99, 95, 98, 96, 94],
        English: [88, 92, 90, 94, 91, 95, 93, 96, 89, 93, 91, 88],
        'Regional Language': [85, 89, 87, 91, 88, 92, 90, 93, 86, 90, 88, 85]
      }
    },
    'V002': {
      id: 'V002',
      name: 'Ms. Sunita Joshi',
      age: 28,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Pune, Maharashtra',
      expertIn: 'English',
      feedback: 'Good communication skills, needs to work on student engagement',
      attendance: {
        Mathematics: [78, 82, 80, 85, 83, 87, 84, 88, 81, 85, 83, 80],
        English: [96, 99, 97, 100, 98, 100, 99, 100, 96, 99, 97, 95],
        'Regional Language': [90, 94, 92, 96, 93, 97, 95, 98, 91, 95, 93, 90]
      }
    }
  };

  const centerData = {
    'C001': {
      id: 'C001',
      name: 'Mumbai Education Center',
      location: 'Mumbai, Maharashtra',
      volunteers: 25,
      students: 150,
      monthlyData: [
        { month: 'Jan', volunteers: 20, students: 120 },
        { month: 'Feb', volunteers: 22, students: 130 },
        { month: 'Mar', volunteers: 24, students: 140 },
        { month: 'Apr', volunteers: 25, students: 150 },
        { month: 'May', volunteers: 23, students: 145 },
        { month: 'Jun', volunteers: 25, students: 150 },
        { month: 'Jul', volunteers: 26, students: 155 },
        { month: 'Aug', volunteers: 24, students: 148 },
        { month: 'Sep', volunteers: 27, students: 160 },
        { month: 'Oct', volunteers: 28, students: 165 },
        { month: 'Nov', volunteers: 29, students: 170 },
        { month: 'Dec', volunteers: 30, students: 175 }
      ]
    },
    'C002': {
      id: 'C002',
      name: 'Pune Learning Hub',
      location: 'Pune, Maharashtra',
      volunteers: 18,
      students: 110,
      monthlyData: [
        { month: 'Jan', volunteers: 15, students: 90 },
        { month: 'Feb', volunteers: 16, students: 95 },
        { month: 'Mar', volunteers: 17, students: 100 },
        { month: 'Apr', volunteers: 18, students: 110 },
        { month: 'May', volunteers: 17, students: 105 },
        { month: 'Jun', volunteers: 18, students: 110 },
        { month: 'Jul', volunteers: 19, students: 115 },
        { month: 'Aug', volunteers: 18, students: 112 },
        { month: 'Sep', volunteers: 20, students: 120 },
        { month: 'Oct', volunteers: 21, students: 125 },
        { month: 'Nov', volunteers: 22, students: 130 },
        { month: 'Dec', volunteers: 23, students: 135 }
      ]
    },
    'C003': {
      id: 'C003',
      name: 'Nashik Knowledge Center',
      location: 'Nashik, Maharashtra',
      volunteers: 12,
      students: 80,
      monthlyData: [
        { month: 'Jan', volunteers: 10, students: 65 },
        { month: 'Feb', volunteers: 10, students: 68 },
        { month: 'Mar', volunteers: 11, students: 70 },
        { month: 'Apr', volunteers: 12, students: 80 },
        { month: 'May', volunteers: 11, students: 75 },
        { month: 'Jun', volunteers: 12, students: 80 },
        { month: 'Jul', volunteers: 13, students: 85 },
        { month: 'Aug', volunteers: 12, students: 82 },
        { month: 'Sep', volunteers: 14, students: 88 },
        { month: 'Oct', volunteers: 15, students: 92 },
        { month: 'Nov', volunteers: 16, students: 95 },
        { month: 'Dec', volunteers: 17, students: 100 }
      ]
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const subjects = ['Mathematics', 'English', 'Regional Language'];
  const colors = ['#3B82F6', '#10B981', '#F59E0B'];

  const handleSearch = () => {
    if (activeTab === 'student') {
      setSelectedStudent(studentsData[searchId] || null);
      setSelectedVolunteer(null);
      setSelectedCenter(null);
    } else if (activeTab === 'volunteer') {
      setSelectedVolunteer(volunteersData[searchId] || null);
      setSelectedStudent(null);
      setSelectedCenter(null);
    } else if (activeTab === 'center') {
      setSelectedCenter(centerData[searchId] || null);
      setSelectedStudent(null);
      setSelectedVolunteer(null);
    }
  };

  const calculateAverage = (marks) => {
    const total = marks.reduce((sum, mark) => sum + mark, 0);
    return Math.round(total / marks.length);
  };

  const getAttendanceData = (attendance) => {
    return months.map((month, index) => ({
      month,
      Mathematics: attendance.Mathematics[index] || 0,
      English: attendance.English[index] || 0,
      'Regional Language': attendance['Regional Language'][index] || 0
    }));
  };

  const getMarksData = (marks) => {
    return months.map((month, index) => ({
      month,
      Mathematics: marks.Mathematics[index] || 0,
      English: marks.English[index] || 0,
      'Regional Language': marks['Regional Language'][index] || 0
    }));
  };

  const getPieData = (data, type = 'marks') => {
    return subjects.map((subject, index) => ({
      name: subject,
      value: type === 'marks' ? calculateAverage(data[subject]) : Math.round(data[subject].reduce((a, b) => a + b, 0) / 12),
      color: colors[index]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Education Management Dashboard</h1>
          <p className="text-gray-600">Manage students, volunteers, and center information</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'student', label: 'Student', icon: User },
            
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSelectedStudent(null);
                setSelectedVolunteer(null);
                setSearchId('');
              }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Search Section */}
        {(activeTab === 'student' || activeTab === 'volunteer' || activeTab === 'center') && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search {activeTab === 'student' ? 'Student' : activeTab === 'volunteer' ? 'Volunteer' : 'Center'} ID
                </label>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder={`Enter ${activeTab === 'student' ? 'Student' : activeTab === 'volunteer' ? 'Volunteer' : 'Center'} ID (e.g., ${activeTab === 'student' ? 'S001, S002' : activeTab === 'volunteer' ? 'V001, V002' : 'C001, C002, C003'})`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 mt-6"
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}

        {/* Student Details */}
        {activeTab === 'student' && selectedStudent && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-6">
                <img
                  src={selectedStudent.image}
                  alt={selectedStudent.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                  <p className="text-gray-600">Age: {selectedStudent.age} | Level: {selectedStudent.level}</p>
                  <p className="text-gray-600">Location: {selectedStudent.location}</p>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>Feedback:</strong> {selectedStudent.feedback}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Monthly Attendance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getAttendanceData(selectedStudent.attendance)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {subjects.map((subject, index) => (
                      <Bar key={subject} dataKey={subject} fill={colors[index]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Marks Line Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2" size={20} />
                  Monthly Marks Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getMarksData(selectedStudent.marks)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {subjects.map((subject, index) => (
                      <Line key={subject} type="monotone" dataKey={subject} stroke={colors[index]} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Attendance Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="mr-2" size={20} />
                  Average Attendance by Subject
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={getPieData(selectedStudent.attendance, 'attendance')}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {getPieData(selectedStudent.attendance, 'attendance').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Marks Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="mr-2" size={20} />
                  Average Marks by Subject
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={getPieData(selectedStudent.marks)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getPieData(selectedStudent.marks).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-center py-2">Math</th>
                        <th className="text-center py-2">English</th>
                        <th className="text-center py-2">Regional</th>
                      </tr>
                    </thead>
                    <tbody>
                      {months.map((month, index) => (
                        <tr key={month} className="border-b">
                          <td className="py-2">{month}</td>
                          <td className="text-center py-2">{selectedStudent.attendance.Mathematics[index]}%</td>
                          <td className="text-center py-2">{selectedStudent.attendance.English[index]}%</td>
                          <td className="text-center py-2">{selectedStudent.attendance['Regional Language'][index]}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marks Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Marks Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-center py-2">Math</th>
                        <th className="text-center py-2">English</th>
                        <th className="text-center py-2">Regional</th>
                      </tr>
                    </thead>
                    <tbody>
                      {months.map((month, index) => (
                        <tr key={month} className="border-b">
                          <td className="py-2">{month}</td>
                          <td className="text-center py-2">{selectedStudent.marks.Mathematics[index]}</td>
                          <td className="text-center py-2">{selectedStudent.marks.English[index]}</td>
                          <td className="text-center py-2">{selectedStudent.marks['Regional Language'][index]}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 font-semibold">
                        <td className="py-2">Average</td>
                        <td className="text-center py-2">{calculateAverage(selectedStudent.marks.Mathematics)}</td>
                        <td className="text-center py-2">{calculateAverage(selectedStudent.marks.English)}</td>
                        <td className="text-center py-2">{calculateAverage(selectedStudent.marks['Regional Language'])}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Volunteer Details */}
        {activeTab === 'volunteer' && selectedVolunteer && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-6">
                <img
                  src={selectedVolunteer.image}
                  alt={selectedVolunteer.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedVolunteer.name}</h2>
                  <p className="text-gray-600">Age: {selectedVolunteer.age}</p>
                  <p className="text-gray-600">Location: {selectedVolunteer.location}</p>
                  <p className="text-gray-600">Expert in: {selectedVolunteer.expertIn}</p>
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>Feedback:</strong> {selectedVolunteer.feedback}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Monthly Teaching Attendance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getAttendanceData(selectedVolunteer.attendance)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {subjects.map((subject, index) => (
                      <Bar key={subject} dataKey={subject} fill={colors[index]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Attendance Line Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2" size={20} />
                  Teaching Attendance Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getAttendanceData(selectedVolunteer.attendance)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {subjects.map((subject, index) => (
                      <Line key={subject} type="monotone" dataKey={subject} stroke={colors[index]} strokeWidth={2} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Attendance Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="mr-2" size={20} />
                  Average Teaching Attendance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={getPieData(selectedVolunteer.attendance, 'attendance')}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {getPieData(selectedVolunteer.attendance, 'attendance').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Distribution</h3>
                <div className="space-y-4">
                  {subjects.map((subject, index) => {
                    const avg = Math.round(selectedVolunteer.attendance[subject].reduce((a, b) => a + b, 0) / 12);
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{subject}</span>
                        <div className="flex items-center space-x-2 flex-1 ml-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${avg}%`, backgroundColor: colors[index] }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12">{avg}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Attendance Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Month</th>
                      <th className="text-center py-2">Mathematics</th>
                      <th className="text-center py-2">English</th>
                      <th className="text-center py-2">Regional Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {months.map((month, index) => (
                      <tr key={month} className="border-b">
                        <td className="py-2">{month}</td>
                        <td className="text-center py-2">{selectedVolunteer.attendance.Mathematics[index]}%</td>
                        <td className="text-center py-2">{selectedVolunteer.attendance.English[index]}%</td>
                        <td className="text-center py-2">{selectedVolunteer.attendance['Regional Language'][index]}%</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 font-semibold">
                      <td className="py-2">Average</td>
                      <td className="text-center py-2">{Math.round(selectedVolunteer.attendance.Mathematics.reduce((a, b) => a + b, 0) / 12)}%</td>
                      <td className="text-center py-2">{Math.round(selectedVolunteer.attendance.English.reduce((a, b) => a + b, 0) / 12)}%</td>
                      <td className="text-center py-2">{Math.round(selectedVolunteer.attendance['Regional Language'].reduce((a, b) => a + b, 0) / 12)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Center Statistics */}
        {activeTab === 'center' && selectedCenter && (
          <div className="space-y-6">
            {/* Center Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Building className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCenter.name}</h2>
                  <p className="text-gray-600">Center ID: {selectedCenter.id}</p>
                  <p className="text-gray-600">Location: {selectedCenter.location}</p>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Volunteers</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedCenter.volunteers}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-green-600">{selectedCenter.students}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="mr-2" size={20} />
                  Monthly Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selectedCenter.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volunteers" fill="#3B82F6" name="Volunteers" />
                    <Bar dataKey="students" fill="#10B981" name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2" size={20} />
                  Growth Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedCenter.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="volunteers" stroke="#3B82F6" strokeWidth={2} name="Volunteers" />
                    <Line type="monotone" dataKey="students" stroke="#10B981" strokeWidth={2} name="Students" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="mr-2" size={20} />
                  Current Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Students', value: selectedCenter.students, color: '#10B981' },
                        { name: 'Volunteers', value: selectedCenter.volunteers, color: '#3B82F6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#3B82F6" />
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statistics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-center py-2">Volunteers</th>
                        <th className="text-center py-2">Students</th>
                        <th className="text-center py-2">Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCenter.monthlyData.map((data) => (
                        <tr key={data.month} className="border-b">
                          <td className="py-2">{data.month}</td>
                          <td className="text-center py-2">{data.volunteers}</td>
                          <td className="text-center py-2">{data.students}</td>
                          <td className="text-center py-2">1:{Math.round(data.students / data.volunteers)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center Overview - when no specific center is selected */}
        {activeTab === 'center' && !selectedCenter && !searchId && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(centerData).map((center) => (
                <div key={center.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">{center.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{center.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{center.location}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Volunteers</p>
                      <p className="text-xl font-bold text-blue-600">{center.volunteers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Students</p>
                      <p className="text-xl font-bold text-green-600">{center.students}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSearchId(center.id);
                      setSelectedCenter(center);
                    }}
                    className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Building size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Center Management</h3>
              <p className="text-gray-600">
                Search for a specific center ID or select from the center cards above to view detailed statistics and analytics.
              </p>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {((activeTab === 'student' && searchId && !selectedStudent) || 
          (activeTab === 'volunteer' && searchId && !selectedVolunteer) ||
          (activeTab === 'center' && searchId && !selectedCenter)) && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              {activeTab === 'student' 
                ? 'Please try searching with valid Student IDs: S001, S002' 
                : activeTab === 'volunteer'
                ? 'Please try searching with valid Volunteer IDs: V001, V002'
                : 'Please try searching with valid Center IDs: C001, C002, C003'}
            </p>
          </div>
        )}

        {/* Default Message */}
        {activeTab !== 'center' && !selectedStudent && !selectedVolunteer && !searchId && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              {activeTab === 'student' ? <User size={48} className="mx-auto" /> : <Users size={48} className="mx-auto" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Search for {activeTab === 'student' ? 'Student' : 'Volunteer'} Details
            </h3>
            <p className="text-gray-600">
              Enter {activeTab === 'student' ? 'a student' : 'a volunteer'} ID to view detailed information, charts, and statistics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;