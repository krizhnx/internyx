import { useState, useEffect } from 'react'
import { X, Building, User, MapPin, Calendar, FileText, Tag, DollarSign, Download, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

function EditInternshipModal({ internship, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    company_name: internship.company_name || '',
    role: internship.role || '',
    location: internship.location || 'remote',
    location_place: internship.location_place || '',
    status: internship.status || 'applied',
    applied_date: internship.applied_date || '',
    deadline: internship.deadline || '',
    salary: internship.salary || '',
    notes: internship.notes || '',
    tags: internship.tags || []
  })
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [files, setFiles] = useState(internship.files || [])

  // Predefined tags
  const predefinedTags = [
    { name: 'Dream Company', color: '#ef4444' },
    { name: 'Priority', color: '#f59e0b' },
    { name: 'Tech', color: '#3b82f6' },
    { name: 'Finance', color: '#10b981' },
    { name: 'Remote', color: '#8b5cf6' },
    { name: 'Startup', color: '#ec4899' }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        ...formData,
        files: files // Include files in the update
      }
      await onUpdate(updateData)
    } catch (error) {
      console.error('Error updating internship:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleTag = (tagName) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(tag => tag !== tagName)
        : [...prev.tags, tagName]
    }))
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(), 200)
  }

  return (
    <div className={`modal-overlay ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`modal-content ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit Internship
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role/Position *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="e.g., Software Engineering Intern"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field pl-10"
                  >
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location Place
                </label>
                <input
                  type="text"
                  name="location_place"
                  value={formData.location_place}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="e.g., 8000/month"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Applied Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="applied_date"
                    value={formData.applied_date}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deadline
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      formData.tags.includes(tag.name)
                        ? 'text-white shadow-md'
                        : 'hover:shadow-sm'
                    }`}
                    style={{ 
                      backgroundColor: formData.tags.includes(tag.name) ? tag.color : `${tag.color}20`,
                      color: formData.tags.includes(tag.name) ? 'white' : tag.color,
                      border: `1px solid ${tag.color}40`
                    }}
                  >
                    <Tag className="h-3 w-3" />
                    <span className="font-medium">{tag.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attachments
              </label>
              {files && files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
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
                           <Download className="h-4 w-4" />
                         </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No attachments for this internship
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="input-field pl-10 resize-none"
                  placeholder="Add any notes about this application..."
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary flex-1 btn-animate"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.company_name || !formData.role}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed btn-animate"
              >
                {loading ? (
                  <div className="loading-spinner rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Update Internship'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditInternshipModal 