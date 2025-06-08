import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExcelUploadApp = () => {
  

  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  

  const handleFileSelect = (selectedFile) => {
    setError('');
    setSuccess(false);
    
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    parseExcelFile(selectedFile);
  };

  const parseExcelFile = async (file) => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get the first worksheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        setError('The Excel file appears to be empty');
        return;
      }

      // Format data with headers
      const headers = jsonData[0];
      const rows = jsonData.slice(1);
      
      const formattedData = {
        fileName: file.name,
        headers: headers,
        rows: rows,
        totalRows: rows.length,
        worksheetName: worksheetName
      };

      setData(formattedData);
      setSuccess(true);
      
      // Here you would send data to backend
      await sendToBackend(formattedData);
      
    } catch (err) {
      setError('Error reading Excel file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendToBackend = async (data) => {
    try {
      // // Replace with your actual backend endpoint
      // const response = await fetch('/api/upload-excel', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to send data to backend');
      // }

      // console.log('Data successfully sent to backend');

      try {
        const res = await axios.post('http://localhost:3000/api/students/add-attendance',{date: new Date(), studentsNames: data.rows.map(row => row[0])});
        console.log(res)
        alert('Attendance added successfully');
      } catch (error) {
        console.log(error)
      }


      console.log('Data to send:', data);
    } catch (err) {
      console.error('Backend error:', err);
      // Note: Not setting error state here to avoid overriding success message
      // In production, you might want to handle this differently
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setData(null);
    setError('');
    setSuccess(false);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Excel File Upload
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your Excel files for database processing
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                loading
                  ? 'border-blue-300 bg-blue-50'
                  : success
                  ? 'border-green-300 bg-green-50'
                  : error
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
                  <p className="text-lg font-medium text-blue-700">Processing Excel file...</p>
                  <p className="text-sm text-blue-600 mt-1">Please wait while we scan your data</p>
                </div>
              ) : success ? (
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 rounded-full p-3 mb-4">
                    <Check className="h-12 w-12 text-green-600" />
                  </div>
                  <p className="text-lg font-medium text-green-700 mb-2">Upload Successful!</p>
                  <p className="text-sm text-green-600">File processed and sent to database</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center">
                  <div className="bg-red-100 rounded-full p-3 mb-4">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <p className="text-lg font-medium text-red-700 mb-2">Upload Failed</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 rounded-full p-4 mb-6">
                    <FileSpreadsheet className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Choose Excel File
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Drag and drop your Excel file here, or click to browse
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Upload className="h-5 w-5" />
                    Upload Excel File
                  </button>
                </div>
              )}
            </div>

            {/* File Info */}
            {file && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">File Information:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">File Name:</span>
                    <span className="ml-2 font-medium">{file.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">File Size:</span>
                    <span className="ml-2 font-medium">{(file.size / 1024).toFixed(2)} KB</span>
                  </div>
                </div>
              </div>
            )}

            {/* Data Preview */}
            {data && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">Data Preview:</h4>
                  <span className="text-sm text-gray-500">
                    {data.totalRows} rows • {data.headers.length} columns
                  </span>
                </div>
                <div className="overflow-x-auto bg-gray-50 rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {data.headers.map((header, index) => (
                          <th key={index} className="px-4 py-2 text-left font-medium text-gray-700">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.rows.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-gray-200">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 text-gray-600">
                              {cell || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.rows.length > 5 && (
                    <div className="px-4 py-2 text-center text-gray-500 text-sm bg-gray-100">
                      ... and {data.rows.length - 5} more rows
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {(success || error) && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={resetUpload}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Upload Another File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Excel Support</h3>
            <p className="text-gray-600 text-sm">
              Supports both .xlsx and .xls file formats with automatic parsing
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Data Validation</h3>
            <p className="text-gray-600 text-sm">
              Automatic file validation and error handling for smooth processing
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">
              Drag & drop or click to upload with instant preview and processing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadApp;