import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import { ClerkProvider, SignedIn } from '@clerk/clerk-react'
import CertificateGenerator from '../../frontend/src/components/certificate/certificate.jsx'
import Calendar from './components/ScheduleDisplay/scheduleIcon.jsx/Calendar.jsx'
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx'
import ExcelUploadApp from './components/Excel/Excel.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<AdminDashboard />} />
      <Route path='certificate' element={<CertificateGenerator />} />
      <Route path='sessions' element={<Calendar />} />
      <Route path='excel' element={<ExcelUploadApp />} />
    </Route>
  ))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
)
