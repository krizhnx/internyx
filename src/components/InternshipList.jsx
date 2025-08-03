import { useState } from 'react'
import { Edit, Trash2, Calendar, MapPin, Building, User, MoreVertical, Tag, AlertTriangle, Clock, FileText, Download, ExternalLink, Star, TrendingUp, DollarSign } from 'lucide-react'
import { supabase } from '../lib/supabase'
import EditInternshipModal from './EditInternshipModal'
import SortableInternshipCard from './SortableInternshipCard'

function InternshipList({ internships, onUpdate, onDelete, onMarkAsApplied, dragMode = false }) {
  const [editingInternship, setEditingInternship] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
    switch (status) {
      case 'saved': return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800`
      case 'applied': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800`
      case 'interviewing': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800`
      case 'offer': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800`
      case 'rejected': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800`
      default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700`
    }
  }

  const getPriorityBadge = (priority) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
    switch (priority) {
      case 'high': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800`
      case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800`
      case 'low': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800`
      default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700`
    }
  }

  const getLocationBadge = (location) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
    switch (location) {
      case 'remote': return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800`
      case 'on-site': return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800`
      case 'hybrid': return `${baseClasses} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800`
      default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700`
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
      return { type: 'overdue', text: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800' }
    } else if (diffDays <= 3) {
      return { type: 'urgent', text: `${diffDays} day${diffDays === 1 ? '' : 's'} left`, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800' }
    } else if (diffDays <= 7) {
      return { type: 'upcoming', text: `${diffDays} days left`, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' }
    } else {
      return { type: 'normal', text: `${diffDays} days left`, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800' }
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
      <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10"></div>
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            No internships yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
            Get started by adding your first internship application. Track your progress and stay organized throughout your job search.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {internships.map((internship, index) => (
        <SortableInternshipCard key={internship.id} id={internship.id} dragMode={dragMode}>
          <div
            className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-purple-500/10"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 dark:from-blue-900/0 dark:to-purple-900/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 dark:group-hover:from-blue-900/10 dark:group-hover:to-purple-900/10 transition-all duration-300"></div>

            <div className="relative p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left Column - Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mx-auto sm:mx-0 group-hover:scale-105 transition-transform duration-300">
                        <Building className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 justify-center sm:justify-start">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {internship.company_name}
                        </h3>
                        <span className={getStatusBadge(internship.status)}>
                          {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                        </span>
                        {internship.status === 'saved' && internship.priority && (
                          <span className={getPriorityBadge(internship.priority)}>
                            {internship.priority.charAt(0).toUpperCase() + internship.priority.slice(1)} Priority
                          </span>
                        )}
                        {internship.deadline && getDeadlineStatus(internship.deadline) && (
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getDeadlineStatus(internship.deadline).color}`}>
                            <Clock className="h-3 w-3" />
                            <span>{getDeadlineStatus(internship.deadline).text}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 break-words font-medium">
                        {internship.role}
                      </p>

                      <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start flex-nowrap overflow-x-auto">
                        <span className={getLocationBadge(internship.location)}>
                          {internship.location.charAt(0).toUpperCase() + internship.location.slice(1)}
                        </span>
                        {internship.location_place && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <MapPin className="h-3 w-3" />
                            <span className="hidden sm:inline">{internship.location_place}</span>
                            <span className="sm:hidden">{internship.location_place.length > 10 ? internship.location_place.substring(0, 10) + '...' : internship.location_place}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex-shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span className="hidden sm:inline">Applied: {formatDate(internship.applied_date)}</span>
                          <span className="sm:hidden">Applied</span>
                        </span>
                        {internship.deadline && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex-shrink-0">
                            <Calendar className="h-3 w-3" />
                            <span className="hidden sm:inline">Deadline: {formatDate(internship.deadline)}</span>
                            <span className="sm:hidden">Deadline</span>
                          </span>
                        )}
                        {internship.salary && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 flex-shrink-0">
                            <DollarSign className="h-3 w-3" />
                            <span className="hidden sm:inline">${internship.salary}</span>
                            <span className="sm:hidden">${internship.salary}</span>
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {internship.tags && internship.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2 justify-center sm:justify-start">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
                            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                              {internship.tags.map((tagName) => {
                                const predefinedTags = [
                                  { name: 'Dream Company', color: '#ef4444', icon: Star },
                                  { name: 'Priority', color: '#f59e0b', icon: TrendingUp },
                                  { name: 'Tech', color: '#3b82f6', icon: Building },
                                  { name: 'Finance', color: '#10b981', icon: DollarSign },
                                  { name: 'Remote', color: '#8b5cf6', icon: MapPin },
                                  { name: 'Startup', color: '#ec4899', icon: TrendingUp }
                                ]
                                const tag = predefinedTags.find(t => t.name === tagName) || { name: tagName, color: '#6b7280', icon: Tag }
                                const IconComponent = tag.icon
                                return (
                                  <span
                                    key={tagName}
                                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 flex-shrink-0"
                                    style={{
                                      backgroundColor: `${tag.color}15`,
                                      color: tag.color,
                                      borderColor: `${tag.color}40`
                                    }}
                                  >
                                    <IconComponent className="h-3 w-3" />
                                    <span>{tag.name}</span>
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {internship.notes && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border-l-4 border-blue-500 mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Notes</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                            {internship.notes}
                          </p>
                        </div>
                      )}

                      {/* Saved Notes */}
                      {internship.status === 'saved' && internship.saved_notes && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-l-4 border-purple-500 mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Saved Notes</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                            {internship.saved_notes}
                          </p>
                        </div>
                      )}

                      {/* Files */}
                      {internship.files && internship.files.length > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-l-4 border-green-500 mt-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <FileText className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                              Attachments ({internship.files.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {internship.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate block">
                                      {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                  </div>
                                </div>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                                  title="Download file"
                                  onClick={async (e) => {
                                    if (file.url.includes('/storage/v1/object/sign/') && file.path) {
                                      try {
                                        const { data: newSignedUrl, error } = await supabase.storage
                                          .from('internship-files')
                                          .createSignedUrl(file.path, 3600)

                                        if (!error && newSignedUrl?.signedUrl) {
                                          window.open(newSignedUrl.signedUrl, '_blank')
                                          e.preventDefault()
                                        }
                                      } catch (error) {
                                        console.error('Error refreshing signed URL:', error)
                                      }
                                    }
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Actions */}
                <div className="flex flex-col items-center space-y-4 lg:flex-shrink-0 lg:items-end">
                  <div className="flex items-center space-x-2">
                    {internship.status === 'saved' && onMarkAsApplied && (
                      <button
                        onClick={() => onMarkAsApplied(internship.id)}
                        className="p-3 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200 group-hover:scale-105"
                        title="Mark as Applied"
                      >
                        <Calendar className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(internship)}
                      className="p-3 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group-hover:scale-105"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(internship)}
                      className="p-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group-hover:scale-105"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center lg:text-right">
                    {internship.status === 'saved' ? (
                      <>Saved on {new Date(internship.saved_date || internship.created_at).toLocaleDateString()}</>
                    ) : (
                      <>Created on {new Date(internship.created_at).toLocaleDateString()}</>
                    )}
                  </div>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to delete the internship for <span className="font-semibold">{deleteConfirm.company_name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-6 py-3 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InternshipList
