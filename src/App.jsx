import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Homepage from './components/Homepage'
import About from './components/About'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { PageLoader } from './components/Loader'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial dark mode
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setSupabaseError(true)
      setLoading(false)
      setShowLoader(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Add a random delay for better UX (1-3 seconds)
      const randomDelay = Math.random() * 2000 + 1000
      setTimeout(() => {
        setShowLoader(false)
      }, randomDelay)
    }).catch(() => {
      setSupabaseError(true)
      setLoading(false)
      setShowLoader(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (showLoader) {
    return <PageLoader message="Loading your experience..." />
  }

  if (loading) {
    return <PageLoader message="Initializing..." />
  }

  if (supabaseError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mb-6">
              <img
                src={isDarkMode ? "/internyx-white.svg" : "/internyx-black.svg"}
                alt="Logo"
                className="h-16 w-16 object-contain mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Configuration Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please set up your Supabase environment variables in the .env file:
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <code className="text-sm text-gray-700 dark:text-gray-300">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex flex-col">
        {user ? (
          <>
            <Navbar user={user} />
            <main className="flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        ) : (
          <Routes>
            <Route path="/" element={
              <Homepage
                onGetStarted={() => window.location.href = '/auth'}
                onAbout={() => window.location.href = '/about'}
              />
            } />
            <Route path="/about" element={
              <About onBack={() => window.location.href = '/'} />
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App
