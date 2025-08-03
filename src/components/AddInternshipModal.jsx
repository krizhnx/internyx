import { useState, useEffect, useRef } from 'react'
import { X, Building, User, MapPin, Calendar, FileText, Tag, Upload, DollarSign, Download, Trash2, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'

function AddInternshipModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    company_name: '',
    role: '',
    location: 'remote',
    location_place: '',
    status: 'applied',
    applied_date: '',
    deadline: '',
    salary: '',
    notes: '',
    tags: []
  })
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [availableTags, setAvailableTags] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [fileUploading, setFileUploading] = useState(false)

  const fileInputRef = useRef(null)

  // Predefined tags for fallback only (not for UI display)
  const predefinedTags = [
    { name: 'Dream Company', color: '#ef4444' },
    { name: 'Priority', color: '#f59e0b' },
    { name: 'Tech', color: '#3b82f6' },
    { name: 'Finance', color: '#10b981' },
    { name: 'Remote', color: '#8b5cf6' },
    { name: 'Startup', color: '#ec4899' }
  ]

  const fetchCustomTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching tags:', error)
        setAvailableTags([]) // Don't show hardcoded tags
        return
      }

      // Only use database tags
      setAvailableTags(data || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
      setAvailableTags([]) // Don't show hardcoded tags
    }
  }

  useEffect(() => {
    setIsVisible(true)
    fetchCustomTags()

    // Check if bucket exists
    const checkBucket = async () => {
      try {
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()

        if (listError) {
          console.error('Error listing buckets:', listError)
          return
        }

        const bucketExists = buckets.some(bucket => bucket.name === 'internship-files')

        if (!bucketExists) {
          console.log('No internship-files bucket found. Please create it manually in Supabase Dashboard.')
          console.log('1. Go to Supabase Dashboard > Storage')
          console.log('2. Create bucket named "internship-files"')
          console.log('3. Set it to public')
          console.log('4. Run the RLS policies from DatabaseSetup modal')
        } else {
          console.log('Bucket already exists')
        }
      } catch (error) {
        console.error('Error checking bucket:', error)
      }
    }

    checkBucket()
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('internship_draft')
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('internship_draft', JSON.stringify(formData))
  }, [formData])

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    setFileUploading(true)

    try {
      const uploadedFileUrls = []

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert(`File ${file.name} is too large. Maximum size is 10MB.`)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        console.log('Attempting to upload to bucket: internship-files')

        const { data, error } = await supabase.storage
          .from('internship-files')
          .upload(fileName, file)

        if (error) {
          console.error('Error uploading file:', error)
          alert(`Error uploading ${file.name}: ${error.message}`)
          continue
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('internship-files')
          .getPublicUrl(fileName)

        // Try getting a signed URL as alternative
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('internship-files')
          .createSignedUrl(fileName, 3600) // 1 hour expiry

        if (signedUrlError) {
          console.error('Error getting signed URL:', signedUrlError)
        } else {
          console.log('Signed URL:', signedUrlData.signedUrl)
        }

        // Always use signed URL if available, otherwise fall back to public URL
        const finalUrl = signedUrlData?.signedUrl || urlData.publicUrl
        console.log('Final URL to be used:', finalUrl)

        uploadedFileUrls.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: finalUrl,
          path: fileName,
          signedUrl: signedUrlData?.signedUrl // Store signed URL separately for future use
        })
      }

      setUploadedFiles(prev => [...prev, ...uploadedFileUrls])
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Error uploading files. Please try again.')
    } finally {
      setFileUploading(false)
    }
  }

  const removeFile = async (index) => {
    const fileToRemove = uploadedFiles[index]

    try {
      // Delete from Supabase storage
      const { error } = await supabase.storage
        .from('internship-files')
        .remove([fileToRemove.path])

      if (error) {
        console.error('Error deleting file:', error)
        alert('Error deleting file. Please try again.')
        return
      }

      // Remove from local state
      setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error('Error removing file:', error)
      alert('Error removing file. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const internshipData = {
        ...formData,
        files: uploadedFiles
      }

      await onAdd(internshipData)

      // Clear draft after successful submission
      localStorage.removeItem('internship_draft')
      setFormData({
        company_name: '',
        role: '',
        location: 'remote',
        location_place: '',
        status: 'applied',
        applied_date: '',
        deadline: '',
        salary: '',
        notes: '',
        tags: []
      })
      setUploadedFiles([])

      handleClose()
    } catch (error) {
      console.error('Error adding internship:', error)
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
      <div className={`modal-content max-w-2xl ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Add New Internship
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
                    className="input-field pl-10 pr-10 appearance-none"
                  >
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
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
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field pr-10 appearance-none"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
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
                    placeholder="e.g., $8000/month"
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
                {availableTags.map((tag) => (
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
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX, TXT (MAX. 10MB each)</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={fileUploading}
                    />
                  </label>
                </div>

                {fileUploading && (
                  <div className="text-center py-2">
                    <div className="loading-spinner rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uploading files...</p>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
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
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                type="button"
                onClick={() => {
                  const savedData = {
                    ...formData,
                    status: 'saved',
                    saved_date: new Date().toISOString(),
                    saved_notes: formData.notes,
                    priority: 'medium'
                  }
                  onAdd(savedData)
                }}
                disabled={loading || !formData.company_name || !formData.role}
                className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed btn-animate"
              >
                Save for Later
              </button>
              <button
                type="submit"
                disabled={loading || !formData.company_name || !formData.role}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed btn-animate"
              >
                {loading ? (
                  <div className="loading-spinner rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Add Internship'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddInternshipModal
