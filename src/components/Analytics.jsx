import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Briefcase, Calendar, MapPin, TrendingUp, Users, Target, Award, XCircle, Plus } from 'lucide-react'

function Analytics({ internships, onAddInternship }) {
  const statusCounts = internships.reduce((acc, internship) => {
    acc[internship.status] = (acc[internship.status] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    status
  }))

  const COLORS = {
    applied: '#3b82f6',
    interviewing: '#f59e0b',
    offer: '#10b981',
    rejected: '#ef4444'
  }

  const totalInternships = internships.length
  const recentApplications = internships.filter(internship => {
    const appliedDate = new Date(internship.applied_date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return appliedDate >= thirtyDaysAgo
  }).length

  const remoteCount = internships.filter(i => i.location === 'remote').length
  const onSiteCount = internships.filter(i => i.location === 'on-site').length
  const hybridCount = internships.filter(i => i.location === 'hybrid').length

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Target className="h-5 w-5" />
      case 'interviewing': return <Users className="h-5 w-5" />
      case 'offer': return <Award className="h-5 w-5" />
      case 'rejected': return <XCircle className="h-5 w-5" />
      default: return <Briefcase className="h-5 w-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-500'
      case 'interviewing': return 'bg-yellow-500'
      case 'offer': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = totalInternships > 0 ? Math.round((data.value / totalInternships) * 100) : 0
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value} applications ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Status Overview */}
      <div className={`card-elevated p-6 ${totalInternships === 0 ? 'lg:col-span-3' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Application Status
        </h3>
        {totalInternships === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No internships yet
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Start tracking your internship applications to see your progress here
              </p>
              {onAddInternship && (
                <button
                  onClick={onAddInternship}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Internship</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = totalInternships > 0 ? Math.round((count / totalInternships) * 100) : 0
              return (
                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(status)} text-white`}>
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {status}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage}% of total
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Chart */}
      {totalInternships > 0 && (
        <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Status Distribution
        </h3>
        {totalInternships === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p className="text-sm">No data to display</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <div className="relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalInternships}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 mb-4" />
              <p>No data to display</p>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Quick Stats */}
      {totalInternships > 0 && (
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Applications</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {totalInternships}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Recent (30 days)</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {recentApplications}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
              <div className="p-2 bg-purple-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Remote Positions</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {remoteCount}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg">
              <div className="p-2 bg-orange-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">On-site/Hybrid</p>
                <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {onSiteCount + hybridCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics 