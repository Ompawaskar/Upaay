import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import { ClerkProvider, SignedIn } from '@clerk/clerk-react'
import VolunteerGradingComponent from './components/Student/studentTest.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<div>Home Page</div>} />
      <Route path="dashboard" element={<SignedIn > <Dashboard /> </SignedIn>} />
      <Route path="*" element={<div>404 Not Found</div>} />
      <Route path='/test' element={<VolunteerGradingComponent />} />
    </Route>
  ))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
)
