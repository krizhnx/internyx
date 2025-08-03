import { useState } from 'react'
import { Edit, Trash2, Calendar, MapPin, Building, Tag, AlertTriangle, Clock } from 'lucide-react'
import EditInternshipModal from './EditInternshipModal'
import SortableTableRow from './SortableTableRow'

function TableView({ internships, onUpdate, onDelete, dragMode = false }) {
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
    <div className="card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {dragMode && <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-gray-100 w-8"></th>}
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Company</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Location</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Applied</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Deadline</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Tags</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((internship) => (
              <SortableTableRow key={internship.id} id={internship.id} dragMode={dragMode}>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{internship.company_name}</div>
                      {internship.deadline && getDeadlineStatus(internship.deadline) && (
                        <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getDeadlineStatus(internship.deadline).color}`}>
                          <Clock className="h-2.5 w-2.5" />
                          <span>{getDeadlineStatus(internship.deadline).text}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 dark:text-gray-100">{internship.role}</td>
                <td className="py-4 px-4">
                  <span className={getStatusBadge(internship.status)}>
                    {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <span className={getLocationBadge(internship.location)}>
                      {internship.location.charAt(0).toUpperCase() + internship.location.slice(1)}
                    </span>
                    {internship.location_place && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {internship.location_place}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{formatDate(internship.applied_date)}</td>
                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{formatDate(internship.deadline)}</td>
                <td className="py-4 px-4">
                  {internship.tags && internship.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {internship.tags.map((tagName) => {
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
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${tag.color}20`,
                              color: tag.color,
                              border: `1px solid ${tag.color}40`
                            }}
                          >
                            <Tag className="h-2.5 w-2.5" />
                            <span>{tag.name}</span>
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(internship)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(internship)}
                      className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </SortableTableRow>
            ))}
          </tbody>
        </table>

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
    </div>
  )
}

export default TableView
