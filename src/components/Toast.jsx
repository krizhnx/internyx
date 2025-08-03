import { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, AlertTriangle } from 'lucide-react'

function Toast({ message, isVisible, onClose, type = 'success' }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      // Small delay to ensure DOM is ready for animation
      setTimeout(() => setIsAnimating(true), 10)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => {
          onClose()
        }, 300) // Wait for exit animation
      }, 4000) // Increased duration
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Wait for exit animation
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
      case 'success':
      default:
        return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'success':
      default:
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    }
  }

  if (!shouldRender) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 ease-out ${
        isAnimating 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {message}
            </span>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false)
              setTimeout(() => onClose(), 300)
            }}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast 