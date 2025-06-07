import React, { useState, useRef } from 'react';
import { Award, User, Download, Upload, FileText, Users, CheckCircle, AlertCircle } from 'lucide-react';

const CertificateGenerator = () => {
  const [mode, setMode] = useState('single'); // 'single' or 'multiple'
  const [recipientName, setRecipientName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [downloadType, setDownloadType] = useState('png');
  const [volunteers, setVolunteers] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedCertificates, setCompletedCertificates] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setExcelFile(file);
    
    try {
      // Read the file content
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Parse CSV/Excel data - assume first column is names
      const volunteerNames = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          // Handle both CSV and tab-separated values
          const name = line.split(/[,\t]/)[0].trim().replace(/"/g, '');
          if (name && name.toLowerCase() !== 'name') { // Skip header if present
            volunteerNames.push(name);
          }
        }
      }
      
      setVolunteers(volunteerNames);
    } catch (error) {
      alert('Error reading file. Please ensure it\'s a valid CSV or text file with names.');
    }
  };

  const generateCertificateCanvas = (name) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 1200;
      canvas.height = 800;
      
      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw border
      ctx.strokeStyle = '#f7ac2d';
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Inner border
      ctx.strokeStyle = '#003c64';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
      
      ctx.textAlign = 'center';
      ctx.fillStyle = '#003c64';
      
      // Draw NGO UPAY
      ctx.font = 'bold 56px Arial';
      ctx.fillText('NGO UPAY', canvas.width / 2, 120);
      
      // Draw decorative line
      ctx.fillStyle = '#f7ac2d';
      ctx.fillRect(canvas.width / 2 - 100, 140, 200, 6);
      
      // Certificate title
      ctx.fillStyle = '#003c64';
      ctx.font = 'bold 40px Arial';
      ctx.fillText('CERTIFICATE OF VOLUNTEERING', canvas.width / 2, 200);
      
      // Subtitle
      ctx.fillStyle = '#666666';
      ctx.font = '26px Arial';
      ctx.fillText('This certificate is proudly presented to', canvas.width / 2, 270);
      
      // Recipient name
      ctx.fillStyle = '#003c64';
      ctx.font = 'bold 68px serif';
      ctx.fillText(name, canvas.width / 2, 350);
      
      // Underline for name
      ctx.fillStyle = '#f7ac2d';
      const textWidth = ctx.measureText(name).width;
      ctx.fillRect(canvas.width / 2 - textWidth / 2 - 20, 370, textWidth + 40, 4);
      
      // Achievement details
      ctx.fillStyle = '#333333';
      ctx.font = '24px Arial';
      ctx.fillText('for completing 90 hours of volunteering service', canvas.width / 2, 440);
      ctx.fillText('as a Subject Volunteer at School Name', canvas.width / 2, 480);
      
      // Date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      ctx.fillStyle = '#666666';
      ctx.font = '20px Arial';
      ctx.fillText(`Issued on: ${currentDate}`, canvas.width / 2, 550);
      
      // Signature section
      ctx.fillStyle = '#003c64';
      ctx.fillRect(canvas.width - 280, 680, 220, 3);
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Authorized Signature', canvas.width - 170, 710);
      
      // Add decorative elements
      const drawStar = (x, y, size) => {
        ctx.fillStyle = '#f7ac2d';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5;
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      };
      
      drawStar(100, 100, 15);
      drawStar(canvas.width - 100, 100, 15);
      drawStar(100, canvas.height - 100, 15);
      drawStar(canvas.width - 100, canvas.height - 100, 15);
      
      resolve(canvas);
    });
  };

  const handleSingleCertificate = () => {
    if (recipientName.trim()) {
      setShowCertificate(true);
    }
  };

  const handleMultipleCertificates = async () => {
    if (volunteers.length === 0) {
      alert('Please upload a file with volunteer names first.');
      return;
    }

    setIsProcessing(true);
    const certificates = [];

    for (const volunteer of volunteers) {
      try {
        const canvas = await generateCertificateCanvas(volunteer);
        const dataUrl = canvas.toDataURL('image/png');
        certificates.push({
          name: volunteer,
          imageData: dataUrl,
          status: 'completed'
        });
      } catch (error) {
        certificates.push({
          name: volunteer,
          imageData: null,
          status: 'error'
        });
      }
    }

    setCompletedCertificates(certificates);
    setIsProcessing(false);
  };

  const handleSingleDownload = async () => {
    const canvas = await generateCertificateCanvas(recipientName);
    
    if (downloadType === 'png') {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${recipientName}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } else {
      const imgData = canvas.toDataURL('image/png');
      // Note: jsPDF would be needed for PDF export in a real implementation
      alert('PDF export requires jsPDF library. Downloading as PNG instead.');
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${recipientName}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    }
  };

  const downloadAllCertificates = () => {
    completedCertificates.forEach((cert, index) => {
      if (cert.status === 'completed') {
        const link = document.createElement('a');
        link.href = cert.imageData;
        link.download = `${cert.name}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const resetAll = () => {
    setMode('single');
    setRecipientName('');
    setShowCertificate(false);
    setVolunteers([]);
    setExcelFile(null);
    setCompletedCertificates([]);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#f7ac2d20' }}>
              <Award className="h-8 w-8" style={{ color: '#f7ac2d' }} />
            </div>
            <h1 className="text-4xl font-bold" style={{ color: '#003c64' }}>
              Certificate Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600">Generate professional volunteer certificates</p>
        </div>

        {!showCertificate && completedCertificates.length === 0 && (
          <div className="max-w-2xl mx-auto">
            {/* Mode Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#003c64' }}>
                Choose Generation Mode
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setMode('single')}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    mode === 'single' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-8 w-8 mx-auto mb-3" style={{ color: mode === 'single' ? '#003c64' : '#666' }} />
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#003c64' }}>Single Volunteer</h3>
                  <p className="text-gray-600 text-sm">Generate one certificate at a time</p>
                </button>
                
                <button
                  onClick={() => setMode('multiple')}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    mode === 'multiple' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="h-8 w-8 mx-auto mb-3" style={{ color: mode === 'multiple' ? '#003c64' : '#666' }} />
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#003c64' }}>Multiple Volunteers</h3>
                  <p className="text-gray-600 text-sm">Upload CSV/Excel file with names</p>
                </button>
              </div>

              {/* Single Mode Form */}
              {mode === 'single' && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-medium mb-3" style={{ color: '#003c64' }}>
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Recipient Name</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Enter the recipient's full name"
                      className="w-full border-2 p-4 rounded-xl focus:ring-4 focus:border-transparent outline-none transition-all text-lg"
                      style={{ 
                        borderColor: '#e5e7eb',
                        focusRingColor: '#f7ac2d40'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSingleCertificate}
                    disabled={!recipientName.trim()}
                    className="w-full px-6 py-4 text-white rounded-xl flex items-center justify-center space-x-3 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transform hover:scale-105"
                    style={{ backgroundColor: '#003c64' }}
                  >
                    <Award className="h-6 w-6" />
                    <span>Generate Certificate</span>
                  </button>
                </div>
              )}

              {/* Multiple Mode Form */}
              {mode === 'multiple' && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-medium mb-3" style={{ color: '#003c64' }}>
                      <div className="flex items-center space-x-2">
                        <Upload className="h-5 w-5" />
                        <span>Upload File (CSV/TXT)</span>
                      </div>
                    </label>
                    <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-gray-400 transition-all">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 rounded-lg border-2 hover:bg-gray-50 transition-all"
                        style={{ borderColor: '#e5e7eb', color: '#003c64' }}
                      >
                        <FileText className="h-5 w-5" />
                        <span>Choose File</span>
                      </button>
                      {excelFile && (
                        <p className="mt-3 text-sm text-gray-600">
                          Selected: {excelFile.name}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Upload a CSV or TXT file with volunteer names (one per line)
                      </p>
                    </div>
                  </div>

                  {volunteers.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium mb-2" style={{ color: '#003c64' }}>
                        Found {volunteers.length} volunteers:
                      </h4>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {volunteers.slice(0, 10).map((name, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{name}</span>
                            </div>
                          ))}
                          {volunteers.length > 10 && (
                            <div className="col-span-2 text-gray-500 text-center">
                              ... and {volunteers.length - 10} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleMultipleCertificates}
                    disabled={volunteers.length === 0 || isProcessing}
                    className="w-full px-6 py-4 text-white rounded-xl flex items-center justify-center space-x-3 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transform hover:scale-105"
                    style={{ backgroundColor: '#f7ac2d' }}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Generating Certificates...</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-6 w-6" />
                        <span>Generate All Certificates</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Single Certificate Display */}
        {showCertificate && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all font-medium"
                style={{ borderColor: '#e5e7eb', color: '#003c64' }}
              >
                ← Back
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="flex bg-white border-2 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setDownloadType('png')}
                    className={`px-4 py-2 ${downloadType === 'png' ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setDownloadType('pdf')}
                    className={`px-4 py-2 ${downloadType === 'pdf' ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    PDF
                  </button>
                </div>
                
                <button
                  onClick={handleSingleDownload}
                  className="px-6 py-3 text-white rounded-xl flex items-center space-x-2 hover:opacity-90 transition-all font-medium transform hover:scale-105"
                  style={{ backgroundColor: '#f7ac2d' }}
                >
                  <Download className="h-5 w-5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="bg-white rounded-2xl shadow-2xl p-12 mx-auto max-w-4xl border-4" style={{ borderColor: '#f7ac2d' }}>
              <div className="text-center space-y-8">
                <div>
                  <h1 className="text-5xl font-bold mb-4" style={{ color: '#003c64' }}>NGO UPAY</h1>
                  <div className="w-24 h-1 mx-auto rounded" style={{ backgroundColor: '#f7ac2d' }}></div>
                </div>
                
                <h2 className="text-3xl font-bold tracking-wide" style={{ color: '#003c64' }}>
                  CERTIFICATE OF VOLUNTEERING
                </h2>
                
                <p className="text-xl text-gray-600">This certificate is proudly presented to</p>
                
                <div className="py-6">
                  <div className="text-6xl font-bold mb-4 border-b-4 pb-4" style={{ color: '#003c64', borderColor: '#f7ac2d' }}>
                    {recipientName}
                  </div>
                </div>
                
                <div className="space-y-4 text-lg">
                  <p>for completing <strong style={{ color: '#003c64' }}>90 hours</strong> of volunteering service</p>
                  <p>as a <strong style={{ color: '#003c64' }}>Subject Volunteer</strong> at <strong style={{ color: '#003c64' }}>School Name</strong></p>
                </div>
                
                <div className="pt-8">
                  <p className="text-gray-600 mb-8">
                    Issued on: {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  
                  <div className="flex justify-end">
                    <div className="text-center">
                      <div className="w-48 h-1 mb-2" style={{ backgroundColor: '#003c64' }}></div>
                      <p className="font-medium" style={{ color: '#003c64' }}>Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multiple Certificates Results */}
        {completedCertificates.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#003c64' }}>
                  Generated Certificates ({completedCertificates.length})
                </h2>
                <div className="flex space-x-4">
                  <button
                    onClick={downloadAllCertificates}
                    className="px-6 py-3 text-white rounded-xl flex items-center space-x-2 hover:opacity-90 transition-all font-medium"
                    style={{ backgroundColor: '#f7ac2d' }}
                  >
                    <Download className="h-5 w-5" />
                    <span>Download All</span>
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all font-medium"
                    style={{ borderColor: '#e5e7eb', color: '#003c64' }}
                  >
                    Generate New
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {completedCertificates.map((cert, index) => (
                  <div key={index} className="border rounded-xl p-4 hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-2 mb-2">
                      {cert.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium truncate" style={{ color: '#003c64' }}>
                        {cert.name}
                      </span>
                    </div>
                    {cert.status === 'completed' && (
                      <img 
                        src={cert.imageData} 
                        alt={`Certificate for ${cert.name}`}
                        className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = cert.imageData;
                          link.download = `${cert.name}_Certificate.png`;
                          link.click();
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateGenerator;