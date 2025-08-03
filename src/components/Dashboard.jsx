import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Analytics from './Analytics'
import InternshipList from './InternshipList'
import TableView from './TableView'
import AddInternshipModal from './AddInternshipModal'
import EditInternshipModal from './EditInternshipModal'
import SaveInternshipModal from './SaveInternshipModal'
import ExportData from './ExportData'
import DatabaseSetup from './DatabaseSetup'
import Toast from './Toast'
import Pagination from './Pagination'
import { Plus, Search, X, Filter, RotateCcw, Tag, GripVertical, Move, Layout, Table, AlertTriangle, Bookmark } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Dashboard({ user }) {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [selectedTags, setSelectedTags] = useState([])
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [showAddTagModal, setShowAddTagModal] = useState(false)
  const [newTag, setNewTag] = useState({ name: '', color: '#6b7280' })
  const [customTags, setCustomTags] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteTagConfirm, setDeleteTagConfirm] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragMode, setDragMode] = useState(false)
  const [viewMode, setViewMode] = useState(localStorage.getItem('defaultView') || 'card')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(localStorage.getItem('itemsPerPage')) || 10)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'saved'

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  // Predefined tags for initialization only (not for UI display)
  const predefinedTags = [
    { name: 'Dream Company', color: '#ef4444' },
    { name: 'Priority', color: '#f59e0b' },
    { name: 'Tech', color: '#3b82f6' },
    { name: 'Finance', color: '#10b981' },
    { name: 'Remote', color: '#8b5cf6' },
    { name: 'Startup', color: '#ec4899' }
  ]

  useEffect(() => {
    fetchInternships()
    fetchCustomTags()
  }, [user])

  useEffect(() => {
    const savedViewMode = localStorage.getItem('defaultView')
    if (savedViewMode) {
      setViewMode(savedViewMode)
    }
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, locationFilter, selectedTags])

  // Listen for settings updates
  useEffect(() => {
    const handleSettingsUpdate = (event) => {
      const { defaultView: newViewMode } = event.detail
      if (newViewMode && newViewMode !== viewMode) {
        setViewMode(newViewMode)
      }
    }

    window.addEventListener('settingsUpdated', handleSettingsUpdate)
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate)
  }, [viewMode])

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching internships:', error)
        if (error.code === '42P01') {
          // Table doesn't exist, show setup modal
          setShowDatabaseSetup(true)
        }
      } else {
        setInternships(data || [])
      }
    } catch (error) {
      console.error('Error fetching internships:', error)
    } finally {
      setLoading(false)
    }
  }

  const addInternship = async (internshipData) => {
    try {
      const { error } = await supabase
        .from('internships')
        .insert([internshipData])

      if (error) {
        console.error('Error adding internship:', error)
        showToast('Error adding internship. Please try again.', 'error')
        return
      }

      await fetchInternships()
      showToast('Internship added successfully!')
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding internship:', error)
      showToast('Error adding internship. Please try again.', 'error')
    }
  }

  const saveInternship = async (internshipData) => {
    try {
      const { error } = await supabase
        .from('internships')
        .insert([internshipData])

      if (error) {
        console.error('Error saving internship:', error)
        showToast('Error saving internship. Please try again.', 'error')
        return
      }

      await fetchInternships()
      showToast('Internship saved successfully!')
      setShowSaveModal(false)
    } catch (error) {
      console.error('Error saving internship:', error)
      showToast('Error saving internship. Please try again.', 'error')
    }
  }

  const updateInternship = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('internships')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchInternships()
      showToast('Internship updated successfully!')
    } catch (error) {
      console.error('Error updating internship:', error)
      showToast('Error updating internship. Please try again.')
    }
  }

  const deleteInternship = async (id) => {
    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchInternships()
      showToast('Internship deleted successfully!')
    } catch (error) {
      console.error('Error deleting internship:', error)
      showToast('Error deleting internship. Please try again.')
    }
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setIsDragging(false)

    if (active.id !== over.id) {
      setInternships((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setLocationFilter('all')
    setSelectedTags([])
  }

  const toggleTag = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(tag => tag !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  const addTag = async () => {
    if (!newTag.name.trim()) {
      showToast('Tag name is required')
      return
    }

    try {
      // Check if tag already exists
      const existingTag = customTags.find(tag => tag.name.toLowerCase() === newTag.name.trim().toLowerCase())
      if (existingTag) {
        showToast('Tag already exists')
        return
      }

      const { error } = await supabase
        .from('tags')
        .insert([{
          name: newTag.name.trim(),
          color: newTag.color,
          user_id: user.id
        }])

      if (error) {
        console.error('Error adding tag:', error)
        showToast('Failed to add tag. Please try again.')
        return
      }

      showToast('Tag added successfully!')
      setShowAddTagModal(false)
      setNewTag({ name: '', color: '#6b7280' })
      fetchCustomTags() // Refresh custom tags after adding
    } catch (error) {
      console.error('Error adding tag:', error)
      showToast('Failed to add tag. Please try again.')
    }
  }

  const deleteTag = async (tagName) => {
    try {
      // Remove the tag from all internships that have it
      const internshipsToUpdate = internships.filter(internship =>
        internship.tags && internship.tags.includes(tagName)
      )

      for (const internship of internshipsToUpdate) {
        const updatedTags = internship.tags.filter(tag => tag !== tagName)
        await supabase
          .from('internships')
          .update({ tags: updatedTags })
          .eq('id', internship.id)
      }

      // Delete the tag from the tags table
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('name', tagName)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Error deleting tag from database:', deleteError)
        showToast('Error deleting tag. Please try again.', 'error')
        return
      }

      // Remove the tag from selected filters
      setSelectedTags(selectedTags.filter(tag => tag !== tagName))

      // Refresh the internships list and custom tags
      await fetchInternships()
      fetchCustomTags()
      showToast(`Tag "${tagName}" deleted successfully`)
      setDeleteTagConfirm(null)
    } catch (error) {
      console.error('Error deleting tag:', error)
      showToast('Error deleting tag. Please try again.', 'error')
    }
  }

  const confirmDeleteTag = (tagName) => {
    setDeleteTagConfirm(tagName)
  }

  const markAsApplied = async (internshipId) => {
    try {
      const { error } = await supabase
        .from('internships')
        .update({
          status: 'applied',
          applied_date: new Date().toISOString().split('T')[0] // Set today as applied date
        })
        .eq('id', internshipId)

      if (error) {
        console.error('Error marking as applied:', error)
        showToast('Error marking as applied. Please try again.', 'error')
        return
      }

      await fetchInternships()
      showToast('Internship marked as applied!')
    } catch (error) {
      console.error('Error marking as applied:', error)
      showToast('Error marking as applied. Please try again.', 'error')
    }
  }

  const addTestInternships = async () => {
    const testInternships = [
      {
        company_name: 'Google',
        role: 'Software Engineering Intern',
        status: 'applied',
        location: 'on-site',
        location_place: 'Mountain View, CA',
        applied_date: '2024-01-15',
        deadline: '2024-02-15',
        salary: '$8000/month',
        notes: 'Applied through university portal. Strong referral from alumni.',
        tags: ['Dream Company', 'Tech']
      },
      {
        company_name: 'Microsoft',
        role: 'Cloud Solutions Intern',
        status: 'interviewing',
        location: 'on-site',
        location_place: 'Redmond, WA',
        applied_date: '2024-01-10',
        deadline: '2024-02-10',
        salary: '$7500/month',
        notes: 'First round interview scheduled for next week. Azure cloud infrastructure and development.',
        tags: ['Tech', 'Priority']
      },
      {
        company_name: 'Netflix',
        role: 'Data Science Intern',
        status: 'rejected',
        location: 'remote',
        location_place: 'Los Gatos, CA',
        applied_date: '2024-01-05',
        deadline: '2024-01-25',
        salary: '$9000/month',
        notes: 'Rejected after technical interview. Need to improve ML skills. Machine learning and recommendation systems.',
        tags: ['Dream Company']
      },
      {
        company_name: 'Stripe',
        role: 'Frontend Engineering Intern',
        status: 'offer',
        location: 'on-site',
        location_place: 'San Francisco, CA',
        applied_date: '2024-01-20',
        deadline: '2024-02-20',
        salary: '$8500/month',
        notes: 'Received offer! Need to respond by end of week. Building payment interfaces and user experiences.',
        tags: ['Tech', 'Startup']
      },
      {
        company_name: 'Airbnb',
        role: 'Product Management Intern',
        status: 'applied',
        location: 'hybrid',
        location_place: 'San Francisco, CA',
        applied_date: '2024-01-18',
        deadline: '2024-02-18',
        salary: '$7000/month',
        notes: 'Applied through LinkedIn. Waiting for response. Product strategy and user research.',
        tags: ['Startup']
      },
      {
        company_name: 'Goldman Sachs',
        role: 'Quantitative Trading Intern',
        status: 'interviewing',
        location: 'on-site',
        location_place: 'New York, NY',
        applied_date: '2024-01-12',
        deadline: '2024-02-12',
        salary: '$10000/month',
        notes: 'Second round interview this Friday. Algorithmic trading and financial modeling.',
        tags: ['Finance', 'Priority']
      },
      {
        company_name: 'Meta',
        role: 'AI Research Intern',
        status: 'applied',
        location: 'hybrid',
        location_place: 'Menlo Park, CA',
        applied_date: '2024-01-22',
        deadline: '2024-02-22',
        salary: '$9500/month',
        notes: 'Applied through research portal. Strong ML background. Research in computer vision and NLP.',
        tags: ['Dream Company', 'Tech']
      },
      {
        company_name: 'Amazon',
        role: 'Backend Engineering Intern',
        status: 'interviewing',
        location: 'on-site',
        location_place: 'Seattle, WA',
        applied_date: '2024-01-08',
        deadline: '2024-02-08',
        salary: '$8000/month',
        notes: 'On-site interview scheduled for next month. AWS infrastructure and distributed systems.',
        tags: ['Tech']
      },
      {
        company_name: 'Uber',
        role: 'Mobile Engineering Intern',
        status: 'rejected',
        location: 'remote',
        location_place: 'San Francisco, CA',
        applied_date: '2024-01-03',
        deadline: '2024-01-23',
        salary: '$7500/month',
        notes: 'Rejected after coding challenge. Need to practice mobile dev. iOS and Android app development.',
        tags: ['Startup']
      },
      {
        company_name: 'JPMorgan Chase',
        role: 'Software Engineering Intern',
        status: 'applied',
        location: 'on-site',
        location_place: 'New York, NY',
        applied_date: '2024-01-25',
        deadline: '2024-02-25',
        salary: '$6500/month',
        notes: 'Applied through university career fair. Financial technology and trading systems.',
        tags: ['Finance']
      },
      {
        company_name: 'Apple',
        role: 'Hardware Engineering Intern',
        status: 'interviewing',
        location: 'on-site',
        location_place: 'Cupertino, CA',
        applied_date: '2024-01-14',
        deadline: '2024-02-14',
        salary: '$8500/month',
        notes: 'Technical interview next week. Need to review hardware concepts. iPhone and Mac hardware development.',
        tags: ['Tech', 'Priority']
      },
      {
        company_name: 'Spotify',
        role: 'Data Engineering Intern',
        status: 'applied',
        location: 'remote',
        location_place: 'New York, NY',
        applied_date: '2024-01-30',
        deadline: '2024-02-28',
        salary: '$7000/month',
        notes: 'Applied through referral. Waiting for response. Music recommendation algorithms and data pipelines.',
        tags: ['Tech', 'Startup']
      },
      {
        company_name: 'Salesforce',
        role: 'Full Stack Engineering Intern',
        status: 'offer',
        location: 'hybrid',
        location_place: 'San Francisco, CA',
        applied_date: '2024-01-16',
        deadline: '2024-02-16',
        salary: '$7500/month',
        notes: 'Received offer! Great company culture and benefits. CRM platform development and cloud services.',
        tags: ['Tech']
      },
      {
        company_name: 'LinkedIn',
        role: 'Machine Learning Intern',
        status: 'interviewing',
        location: 'on-site',
        location_place: 'Sunnyvale, CA',
        applied_date: '2024-01-11',
        deadline: '2024-02-11',
        salary: '$8000/month',
        notes: 'First round interview completed. Waiting for next steps. Recommendation systems and user engagement.',
        tags: ['Tech']
      },
      {
        company_name: 'Tesla',
        role: 'Autonomous Driving Intern',
        status: 'applied',
        location: 'on-site',
        location_place: 'Palo Alto, CA',
        applied_date: '2024-01-28',
        deadline: '2024-02-28',
        salary: '$9000/month',
        notes: 'Applied through university portal. Very competitive position. Self-driving car technology and computer vision.',
        tags: ['Tech', 'Startup']
      }
    ]

    setLoading(true)
    try {
      for (const internship of testInternships) {
        const { error } = await supabase
          .from('internships')
          .insert([{
            ...internship,
            user_id: user.id
          }])

        if (error) throw error
      }

      showToast('15 test internships added successfully!')
      fetchInternships()
    } catch (error) {
      console.error('Error adding test internships:', error)
      showToast('Error adding test internships. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || internship.status === statusFilter
    const matchesLocation = locationFilter === 'all' || internship.location === locationFilter
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag =>
      internship.tags && internship.tags.includes(tag)
    )
    const matchesTab = activeTab === 'all' || internship.status === activeTab

    return matchesSearch && matchesStatus && matchesLocation && matchesTags && matchesTab
  })

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || selectedTags.length > 0

  // Pagination logic
  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedInternships = filteredInternships.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
    localStorage.setItem('itemsPerPage', newItemsPerPage.toString())
  }

  const fetchCustomTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) {
        console.error('Error fetching tags:', error)
        return
      }

      setCustomTags(data || [])

      // Initialize predefined tags if user has no tags
      if (!data || data.length === 0) {
        await initializePredefinedTags()
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const initializePredefinedTags = async () => {
    try {
      const predefinedTagsToInsert = predefinedTags.map(tag => ({
        name: tag.name,
        color: tag.color,
        user_id: user.id
      }))

      const { error } = await supabase
        .from('tags')
        .insert(predefinedTagsToInsert)

      if (error) {
        console.error('Error initializing predefined tags:', error)
        return
      }

      // Refresh the tags list
      await fetchCustomTags()
    } catch (error) {
      console.error('Error initializing predefined tags:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your internships...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Detached Glass Navbar */}
      {/* Removed detached navbar as per edit hint */}

      <div className="space-y-8">
        {/* Analytics */}
        <Analytics internships={internships} onAddInternship={() => setShowAddModal(true)} />

        {/* Export Section */}
        <ExportData internships={internships} user={user} />

        {/* Header */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Internships
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your internship applications and progress
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDragMode(!dragMode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                dragMode
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={dragMode ? 'Exit reorder mode' : 'Reorder internships'}
            >
              <Move className="h-4 w-4" />
              <span className="hidden sm:inline">{dragMode ? 'Exit Reorder' : 'Reorder'}</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'card'
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={viewMode === 'card' ? 'Switch to table view' : 'Switch to card view'}
            >
              {viewMode === 'card' ? <Table className="h-4 w-4" /> : <Layout className="h-4 w-4" />}
              <span className="hidden sm:inline">{viewMode === 'card' ? 'Table View' : 'Card View'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Plus className="h-5 w-5" />
              <span>Add Internship</span>
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Save Internship</span>
            </button>
            <button
              onClick={addTestInternships}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Add Test Data</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            All ({internships.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'saved'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Saved ({internships.filter(i => i.status === 'saved').length})
          </button>
        </div>

        {/* Filters */}
        <div className="card-elevated p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Filters
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors justify-center sm:justify-start"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear filters</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Search and Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search companies or roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2.5">
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  {filteredInternships.length}
                </span>
                <span className="mx-1">of</span>
                <span className="font-medium">{internships.length}</span>
                <span className="ml-1">results</span>
              </div>
            </div>

            {/* Tag Filters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by tags:</span>
                </div>
                <button
                  onClick={() => setShowAddTagModal(true)}
                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Tag</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {/* All tags from database */}
                {customTags.map((tag) => (
                  <div key={tag.name} className="relative group">
                    <button
                      onClick={() => toggleTag(tag.name)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedTags.includes(tag.name)
                          ? 'text-white shadow-md'
                          : 'hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: selectedTags.includes(tag.name) ? tag.color : `${tag.color}20`,
                        color: selectedTags.includes(tag.name) ? 'white' : tag.color,
                        border: `1px solid ${tag.color}40`
                      }}
                    >
                      <Tag className="h-3 w-3" />
                      <span className="font-medium">{tag.name}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        confirmDeleteTag(tag.name)
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title={`Delete "${tag.name}" from all internships`}
                    >
                      <X className="h-2.5 w-2.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Internship List */}
        {viewMode === 'card' ? (
          dragMode ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={paginatedInternships.map(internship => internship.id)}
                strategy={verticalListSortingStrategy}
              >
                <InternshipList
                  internships={paginatedInternships}
                  onUpdate={updateInternship}
                  onDelete={deleteInternship}
                  onMarkAsApplied={markAsApplied}
                  dragMode={dragMode}
                />
              </SortableContext>
            </DndContext>
          ) : (
            <InternshipList
              internships={paginatedInternships}
              onUpdate={updateInternship}
              onDelete={deleteInternship}
              onMarkAsApplied={markAsApplied}
              dragMode={dragMode}
            />
          )
        ) : (
          dragMode ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={paginatedInternships.map(internship => internship.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableView
                  internships={paginatedInternships}
                  onUpdate={updateInternship}
                  onDelete={deleteInternship}
                  dragMode={dragMode}
                />
              </SortableContext>
            </DndContext>
          ) : (
            <TableView
              internships={paginatedInternships}
              onUpdate={updateInternship}
              onDelete={deleteInternship}
              dragMode={dragMode}
            />
          )
        )}

        {/* Pagination */}
        {filteredInternships.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={filteredInternships.length}
          />
        )}

        {/* Add Internship Modal */}
        {showAddModal && (
          <AddInternshipModal
            onClose={() => setShowAddModal(false)}
            onAdd={addInternship}
          />
        )}

        {/* Save Internship Modal */}
        {showSaveModal && (
          <SaveInternshipModal
            onClose={() => setShowSaveModal(false)}
            onSave={saveInternship}
          />
        )}

        {/* Add Tag Modal */}
        {showAddTagModal && (
          <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 pt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Add Custom Tag
                </h3>
                <button
                  onClick={() => {
                    setShowAddTagModal(false)
                    setNewTag({ name: '', color: '#6b7280' })
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Dream Company, Priority"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddTagModal(false)
                    setNewTag({ name: '', color: '#6b7280' })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={addTag}
                  disabled={!newTag.name.trim()}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Database Setup Modal */}
        {showDatabaseSetup && (
          <DatabaseSetup
            onClose={() => setShowDatabaseSetup(false)}
          />
        )}

        {/* Tag Deletion Confirmation Modal */}
        {deleteTagConfirm && (
          <div className="fixed inset-0 flex items-start justify-center bg-black/50 backdrop-blur-sm z-50 pt-16">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Delete Tag
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Are you sure you want to delete the tag <span className="font-semibold">"{deleteTagConfirm}"</span> from all internships? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setDeleteTagConfirm(null)}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTag(deleteTagConfirm)}
                    className="px-6 py-3 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
                  >
                    Delete Tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        <Toast
          message={toast.message}
          isVisible={toast.show}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      </div>
    </div>
  )
}

export default Dashboard
