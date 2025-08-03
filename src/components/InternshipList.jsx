import { useState } from 'react'
import { Edit, Trash2, Calendar, MapPin, Building, User, MoreVertical, Tag, AlertTriangle, Clock, FileText, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import EditInternshipModal from './EditInternshipModal'
import SortableInternshipCard from './SortableInternshipCard'

function InternshipList({ internships, onUpdate, onDelete, dragMode = false }) {
  const [editingInternship, setEditingInternship] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case 'applied': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`
      case 'interviewing': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`
      case 'offer': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`
      case 'rejected': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`
      default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`
    }
  }

  const getLocationBadge = (location) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
    switch (location) {
      case 'remote': return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300`
      case 'on-site': return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300`
      case 'hybrid': return `${baseClasses} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300`
      default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null
    
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { type: 'overdue', text: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    } else if (diffDays <= 3) {
      return { type: 'urgent', text: `${diffDays} day${diffDays === 1 ? '' : 's'} left`, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' }
    } else if (diffDays <= 7) {
      return { type: 'upcoming', text: `${diffDays} days left`, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' }
    } else {
      return { type: 'normal', text: `${diffDays} days left`, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }
    }
  }

  const handleEdit = (internship) => {
    setEditingInternship(internship)
  }

  const handleUpdate = async (updates) => {
    await onUpdate(editingInternship.id, updates)
    setEditingInternship(null)
  }

  const handleDelete = async (id) => {
    await onDelete(id)
    setDeleteConfirm(null)
  }

  const confirmDelete = (internship) => {
    setDeleteConfirm(internship)
  }

  if (internships.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No internships yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Get started by adding your first internship application. Track your progress and stay organized throughout your job search.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {internships.map((internship, index) => (
        <SortableInternshipCard key={internship.id} id={internship.id} dragMode={dragMode}>
          <div 
            className="card-elevated p-6 hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Column - Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mx-auto sm:mx-0">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-center sm:justify-start">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {internship.company_name}
                    </h3>
                    <span className={getStatusBadge(internship.status)}>
                      {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                    </span>
                    {internship.deadline && getDeadlineStatus(internship.deadline) && (
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDeadlineStatus(internship.deadline).color}`}>
                        <Clock className="h-3 w-3" />
                        <span>{getDeadlineStatus(internship.deadline).text}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-white mb-3 break-words">
                    {internship.role}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3 justify-center sm:justify-start">
                    <span className={getLocationBadge(internship.location)}>
                      {internship.location.charAt(0).toUpperCase() + internship.location.slice(1)}
                    </span>
                    {internship.location_place && (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                        <MapPin className="h-3 w-3" />
                        <span>{internship.location_place}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <Calendar className="h-3 w-3" />
                      <span>Applied: {formatDate(internship.applied_date)}</span>
                    </span>
                    {internship.deadline && (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        <Calendar className="h-3 w-3" />
                        <span>Deadline: {formatDate(internship.deadline)}</span>
                      </span>
                    )}
                    {internship.salary && (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <span className="font-bold">$</span>
                        <span>{internship.salary}</span>
                      </span>
                    )}
                    {internship.tags && internship.tags.length > 0 && internship.tags.map((tagName) => {
                      const predefinedTags = [
                        { name: 'Dream Company', color: '#ef4444' },
                        { name: 'Priority', color: '#f59e0b' },
                        { name: 'Tech', color: '#3b82f6' },
                        { name: 'Finance', color: '#10b981' },
                        { name: 'Remote', color: '#8b5cf6' },
                        { name: 'Startup', color: '#ec4899' }
                      ]
                      const tag = predefinedTags.find(t => t.name === tagName) || { name: tagName, color: '#6b7280' }
                      return (
                        <span
                          key={tagName}
                          className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}40`
                          }}
                        >
                          <Tag className="h-3 w-3" />
                          <span>{tag.name}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              {internship.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-primary-500 mt-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                    {internship.notes}
                  </p>
                </div>
              )}

              {internship.files && internship.files.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500 mt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Attachments ({internship.files.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {internship.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                                                 <a
                           href={file.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                           title="Download file"
                           onClick={async (e) => {
                             // If it's a signed URL and might be expired, try to refresh it
                             if (file.url.includes('/storage/v1/object/sign/') && file.path) {
                               try {
                                 const { data: newSignedUrl, error } = await supabase.storage
                                   .from('internship-files')
                                   .createSignedUrl(file.path, 3600)
                                 
                                 if (!error && newSignedUrl?.signedUrl) {
                                   // Update the URL and open the new signed URL
                                   window.open(newSignedUrl.signedUrl, '_blank')
                                   e.preventDefault()
                                 }
                               } catch (error) {
                                 console.error('Error refreshing signed URL:', error)
                                 // Continue with original URL if refresh fails
                               }
                             }
                           }}
                         >
                           <Download className="h-3 w-3" />
                         </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Actions */}
            <div className="flex flex-col items-center space-y-2 lg:flex-shrink-0 lg:items-end">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEdit(internship)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 btn-animate"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => confirmDelete(internship)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 btn-animate"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center lg:text-right">
                Created on {new Date(internship.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        </SortableInternshipCard>
      ))}

      {editingInternship && (
        <EditInternshipModal
          internship={editingInternship}
          onClose={() => setEditingInternship(null)}
          onUpdate={handleUpdate}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
              Are you sure you want to delete the internship for {deleteConfirm.company_name}? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InternshipList 