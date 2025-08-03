import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage'
import About from './components/About'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState(false)

  useEffect(() => {
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setSupabaseError(true)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setSupabaseError(true)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (supabaseError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Configuration Required
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please set up your Supabase environment variables in the .env file:
            </p>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <code className="text-sm">
                VITE_SUPABASE_URL=your_supabase_url<br/>
                VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
              </code>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {user ? (
          <>
            <Navbar user={user} />
            <main className="flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Homepage onGetStarted={() => window.location.href = '/auth'} onAbout={() => window.location.href = '/about'} />} />
            <Route path="/about" element={<About onBack={() => window.location.href = '/'} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App 