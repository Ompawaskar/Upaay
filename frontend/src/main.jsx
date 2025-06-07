import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import { ClerkProvider, SignedIn } from '@clerk/clerk-react'
import VolunteerGradingComponent from './components/Student/studentTest.jsx';
import AttendanceTest from './components/attendance/attendencetest.jsx'
import CertificateGenerator from './components/certificate/certificate.jsx';
import Volunteer from './components/VolunteerSessions/Volunteer.jsx'
import VolunteerScheduler from './components/VolunteerFreeSlots/VolunteerScheduler.jsx'
import Calendar from './components/ScheduleDisplay/scheduleIcon.jsx/Calendar.jsx'



const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const fetchStudents = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/students');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    setStudents(data);
  } catch (error) {
    console.error('Failed to fetch students', error);
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HeroSection/>} />
      <Route path="dashboard" element={<SignedIn > <Dashboard /> </SignedIn>} />
      <Route path="*" element={<div>404 Not Found</div>} />
      <Route path="volunteer-sessions" element={<Volunteer />} />
      <Route path="volunteer-scheduler" element={<VolunteerScheduler />} />
      <Route path='/test' element={<VolunteerGradingComponent />} />
      <Route path='/attendance-test' element={<AttendanceTest />} />
       <Route path="/certificate" element={<CertificateGenerator />} />
      <Route path='/schedule' element={<Calendar/>}/>
    </Route>
  ))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />+
    </ClerkProvider>
  </StrictMode>
)
