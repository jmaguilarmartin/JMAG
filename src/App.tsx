import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Activities } from './pages/Activities'
import { ActivityForm } from './pages/ActivityForm'
import { Categories } from './pages/Categories'
import { MyTrips } from './pages/MyTrips'
import { ImportActivities } from './pages/ImportActivities'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/activities/import" element={<ImportActivities />} />
                    <Route path="/activities/new" element={<ActivityForm />} />
                    <Route path="/activities/:id/edit" element={<ActivityForm />} />
                    <Route path="/my-trips" element={<MyTrips />} />
                    <Route path="/categories" element={<Categories />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
