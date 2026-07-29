import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import EvaluatorDashboard from './pages/EvaluatorDashboard.jsx'
import TestInterface from './pages/TestInterface.jsx'
import NotFound from './pages/NotFound.jsx'
import { useAuth } from './context/AuthContext.jsx'

function RoleRedirect({ fallback = '/login' }) {
  const { user } = useAuth()
  if (!user) return <Navigate to={fallback} replace />
  if (user.role === 'student') return <Navigate to="/student" replace />
  return <Navigate to="/evaluator" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/evaluator" element={<EvaluatorDashboard />} />
      <Route path="/admin" element={<EvaluatorDashboard />} />
      <Route path="/test/:id" element={<TestInterface />} />
      <Route path="/preview" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
