import { Heart, Github, Mail, Building, Globe, Twitter, Linkedin, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'

function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }

    // Check initially
    checkDarkMode()

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Handle scroll to show/hide scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={isDarkMode ? "/internyx-white.svg" : "/internyx-black.svg"}
                  alt="Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                Empowering students to track and optimize their internship applications with ease.
                Your journey to success starts here with our comprehensive platform.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:support@internyx.com"
                  className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-gray-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Contact</span>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-gray-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Github className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-gray-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Twitter className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#dashboard"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#analytics"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#add-internship"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    Add Internship
                  </a>
                </li>
                <li>
                  <a
                    href="#export"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    Export Data
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Resources
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#help"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#api"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                  >
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>for students worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50"
          title="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  )
}

export default Footer
