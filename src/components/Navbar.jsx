import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Moon, Sun, LogOut, User, ChevronDown, Settings, Bell, Search } from 'lucide-react'
import SettingsModal from './Settings'

function Navbar({ user }) {
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={darkMode ? "/internyx-white.svg" : "/internyx-black.svg"}
              alt="Logo"
              className="h-40 w-40 object-contain"
            />
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation links removed */}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleToggleMenu}
                className="flex items-center space-x-3 p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium hidden sm:block max-w-32 truncate">
                  {user.user_metadata?.display_name || user.email}
                </span>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 ${
                  isAnimating ? 'dropdown-enter' : 'dropdown-exit'
                }`}>
                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {user.user_metadata?.display_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleSettingsClick}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3"
                    >
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3"
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
