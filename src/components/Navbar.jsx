import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Moon, Sun, LogOut, User, ChevronDown, Settings } from 'lucide-react'
import SettingsModal from './Settings'

function Navbar({ user }) {
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        handleCloseMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    handleCloseMenu()
  }

  const handleSettingsClick = () => {
    setShowSettings(true)
    handleCloseMenu()
  }

  const handleToggleMenu = () => {
    if (showUserMenu) {
      handleCloseMenu()
    } else {
      setShowUserMenu(true)
      setIsAnimating(true)
    }
  }

  const handleCloseMenu = () => {
    setIsAnimating(false)
    setTimeout(() => setShowUserMenu(false), 200)
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/ChatGPT_Image_Aug_1__2025__07_16_07_PM-removebg-preview.png" 
              alt="INTERNYX Logo" 
              className="h-40 w-40 object-contain"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 btn-animate"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleToggleMenu}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 btn-animate"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-32 truncate">
                  {user.user_metadata?.display_name || user.email}
                </span>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className={`dropdown ${isAnimating ? 'dropdown-enter' : 'dropdown-exit'}`}>
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
                      {user.user_metadata?.display_name || user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleSettingsClick}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showSettings && (
        <SettingsModal 
          user={user} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </nav>
  )
}

export default Navbar 