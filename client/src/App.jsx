import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Questions from './pages/Questions'
import Checklist from './pages/Checklist'
import ChecklistDetail from './pages/ChecklistDetail'
import History from './pages/History'
import Settings from './pages/Settings'
import AdminAnalytics from './pages/AdminAnalytics'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-neu-bg">
        <Navbar />
        <main className="flex-1">
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />

            {/* App home — requires login */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* Protected routes — require a logged-in account */}
            <Route path="/questions/:eventType" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
            <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
            <Route path="/checklist/:id" element={<ProtectedRoute><ChecklistDetail /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
