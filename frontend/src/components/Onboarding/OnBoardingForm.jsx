import React, { useState } from 'react';

function OnBoardingForm() {
  // State for personal details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resume, setResume] = useState(null);

  // State for skills & motivation
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState('');
  const [whyJoin, setWhyJoin] = useState('');

  // State for availability & location
  const [locationPreference, setLocationPreference] = useState('');
  const [workRadius, setWorkRadius] = useState('0'); // Default value is 0
  const [preferredWorkingHoursStart, setPreferredWorkingHoursStart] = useState('');
  const [preferredWorkingHoursEnd, setPreferredWorkingHoursEnd] = useState('');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [engagementType, setEngagementType] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation
    if (!fullName || !email || !whyJoin || !locationPreference || !workRadius || !preferredWorkingHoursStart || !preferredWorkingHoursEnd) {
      alert('Please ensure all required fields are filled.');
      return;
    }

    // Prepare data
    const formData = {
      fullName,
      email,
      phoneNumber,
      resume: resume ? resume.name : null,
      skills,
      experience,
      whyJoin,
      locationPreference,
      workRadius: `${workRadius} km`,
      preferredWorkingHours: `${preferredWorkingHoursStart} - ${preferredWorkingHoursEnd}`,
      isRemoteOnly,
      engagementType,
    };

    console.log('Volunteer Application Submitted:', formData);
    alert('Thank you for your application! We will review it shortly.');

    // Reset form fields
    resetForm();
  };

  const handleSkillsChange = (event) => {
    const selectedOptions = Array.from(event.target.options).filter(option => option.selected);
    setSkills(selectedOptions.map(option => option.value));
  };

  const handleResumeChange = (event) => {
    setResume(event.target.files?.[0]);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setResume(null);
    setSkills([]);
    setExperience('');
    setWhyJoin('');
    setLocationPreference('');
    setWorkRadius('0'); // Reset slider to 0
    setPreferredWorkingHoursStart('');
    setPreferredWorkingHoursEnd('');
    setIsRemoteOnly(false);
    setEngagementType('');
  };

  // Common Tailwind classes for consistency
  const inputBaseClasses = "block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-base transition duration-150 ease-in-out hover:border-blue-300";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // Determine the blue color for the filled part of the slider track
  const blue600 = '#2563EB'; // Tailwind's blue-600
  const gray300 = '#D1D5DB'; // Tailwind's gray-300

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-4xl space-y-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-indigo-800 leading-tight">Join Our Mission</h1>
          <p className="text-xl text-gray-700 mt-2">Apply to become a valued volunteer and make a real difference!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Details */}
          <div className="border-b-2 border-blue-200 pb-8">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <span className="mr-3 text-3xl">📝</span> 1. Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <label htmlFor="fullName" className={labelClasses}>Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g., Jane Doe"
                  className={inputBaseClasses}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>Email Address:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={inputBaseClasses}
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className={labelClasses}>Phone Number (Optional):</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91-1234567890"
                  className={inputBaseClasses}
                />
              </div>

              <div>
                <label htmlFor="resume" className={labelClasses}>Upload Resume/CV (Optional):</label>
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className={`${inputBaseClasses.replace('px-4 py-2.5', 'py-2')} file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0 file:text-sm file:font-semibold
                             file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer`}
                />
                {resume && <p className="mt-2 text-sm text-gray-500">Selected: <span className="font-semibold">{resume.name}</span></p>}
              </div>
            </div>
          </div>

          {/* Section 2: Skills & Motivation */}
          <div className="border-b-2 border-blue-200 pb-8">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <span className="mr-3 text-3xl">🌟</span> 2. Skills & Motivation
            </h3>
            <div className="space-y-5">
              <div>
                <label htmlFor="skills" className={labelClasses}>Your Skills (Select all that apply):</label>
                <select
                  id="skills"
                  multiple
                  value={skills}
                  onChange={handleSkillsChange}
                  className={`${inputBaseClasses} h-40 cursor-pointer`} // Increased height for better visibility
                >
                  <option value="Event Planning">Event Planning</option>
                  <option value="Fundraising">Fundraising</option>
                  <option value="Social Media Management">Social Media Management</option>
                  <option value="Content Writing">Content Writing</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Community Outreach">Community Outreach</option>
                  <option value="Teaching/Tutoring">Teaching/Tutoring</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="First Aid/Medical">First Aid/Medical</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Photography/Videography">Photography/Videography</option>
                  <option value="Public Speaking">Public Speaking</option>
                  <option value="Language Translation">Language Translation</option>
                  <option value="Gardening/Landscaping">Gardening/Landscaping</option>
                  <option value="Administrative Support">Administrative Support</option>
                  <option value="Research">Research</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Finance/Accounting">Finance/Accounting</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
              </div>

              <div>
                <label htmlFor="experience" className={labelClasses}>Relevant Experience (Optional - Years/Brief Description):</label>
                <input
                  type="text"
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 2 years in non-profit coordination, or 'Helped at local food drives'"
                  className={inputBaseClasses}
                />
              </div>

              <div>
                <label htmlFor="whyJoin" className={labelClasses}>Why and How You Want to Join This Organisation:</label>
                <textarea
                  id="whyJoin"
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  rows="7"
                  required
                  placeholder="Tell us about your passion for our cause, relevant experiences, and how you envision making a positive impact with us."
                  className={`${inputBaseClasses} resize-y`}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 3: Availability & Location */}
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <span className="mr-3 text-3xl">📍</span> 3. Availability & Location
            </h3>

            <div>
              <label htmlFor="locationPreference" className={labelClasses}>Preferred Volunteering Location (if applicable):</label>
              <select
                id="locationPreference"
                value={locationPreference}
                onChange={(e) => setLocationPreference(e.target.value)}
                required
                className={inputBaseClasses}
              >
                <option value="">Select a location</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Other">Other (Specify in 'Why to Join' section)</option>
              </select>
            </div>

            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="isRemoteOnly"
                checked={isRemoteOnly}
                onChange={(e) => setIsRemoteOnly(e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isRemoteOnly" className="ml-3 block text-base text-gray-900">
                Willing to volunteer remotely only
              </label>
            </div>

            <div>
              <label htmlFor="workRadius" className={labelClasses}>
                Radius willing to travel for volunteering (in km, if not remote):
                <span className="font-bold text-blue-600 ml-2">{workRadius} km</span>
              </label>
              <input
                type="range"
                id="workRadius"
                value={workRadius}
                onChange={(e) => setWorkRadius(e.target.value)}
                min="0"
                max="100" // Adjust max value as needed
                // FIX: Dynamic background for the slider track
                style={{
                  background: `linear-gradient(to right, ${blue600} 0%, ${blue600} ${workRadius}%, ${gray300} ${workRadius}%, ${gray300} 100%)`
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-lg"
              />
            </div>

            <div>
              <label className={labelClasses}>Preferred Volunteering Hours:</label>
              <div className="flex space-x-4 mt-1">
                <input
                  type="time"
                  id="preferredWorkingHoursStart"
                  value={preferredWorkingHoursStart}
                  onChange={(e) => setPreferredWorkingHoursStart(e.target.value)}
                  required
                  className={inputBaseClasses}
                />
                <span className="self-center text-gray-700 text-lg font-medium">to</span>
                <input
                  type="time"
                  id="preferredWorkingHoursEnd"
                  value={preferredWorkingHoursEnd}
                  onChange={(e) => setPreferredWorkingHoursEnd(e.target.value)}
                  required
                  className={inputBaseClasses}
                />
              </div>
            </div>

            <div>
              <label htmlFor="engagementType" className={labelClasses}>Preferred Volunteer Engagement Type:</label>
              <select
                id="engagementType"
                value={engagementType}
                onChange={(e) => setEngagementType(e.target.value)}
                className={inputBaseClasses}
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time Volunteer</option>
                <option value="Part-time">Part-time Volunteer</option>
                <option value="Flexible">Flexible/Ad-hoc</option>
                <option value="Project-based">Project-based (short-term)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-xl font-semibold text-white
                       bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Volunteer Application
          </button>
        </form>
      </div>
    </div>
  );
}

export default OnBoardingForm;