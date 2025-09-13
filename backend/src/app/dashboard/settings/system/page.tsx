'use client'

import { useState, useEffect } from 'react'
import { 
  CircleStackIcon as DatabaseIcon,
  CloudIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface SystemSettings {
  backupFrequency: string
}

interface BackupOptions {
  backupType: string
  tables: string[]
  includeData: boolean
  includeSchema: boolean
  description: string
}

interface CacheOptions {
  cacheType: string
  specificKeys: string[]
  clearAll: boolean
}

interface SystemInfo {
  application: {
    version: string
    name: string
    environment: string
  }
  database: {
    version: string
    totalUsers: number
    totalMessages: number
    totalBackups: number
    lastBackup: {
      filename: string
      createdAt: string
    } | null
  }
  system: {
    uptime: string
    totalCacheLogs: number
    storage: {
      used: string
      available: string
      total: string
    }
  }
}

interface Table {
  name: string
  description: string
}

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<SystemSettings>({
    backupFrequency: 'daily'
  })
  const [backupOptions, setBackupOptions] = useState<BackupOptions>({
    backupType: 'full',
    tables: [],
    includeData: true,
    includeSchema: true,
    description: ''
  })
  const [cacheOptions, setCacheOptions] = useState<CacheOptions>({
    cacheType: 'all',
    specificKeys: [],
    clearAll: true
  })
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [availableTables, setAvailableTables] = useState<Table[]>([])
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showCacheModal, setShowCacheModal] = useState(false)
  const [backupHistory, setBackupHistory] = useState<any[]>([])
  const [cacheHistory, setCacheHistory] = useState<any[]>([])

  // Load system information and tables on component mount
  useEffect(() => {
    loadSystemInfo()
    loadAvailableTables()
    loadBackupHistory()
    loadCacheHistory()
  }, [])

  const loadSystemInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/system/info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSystemInfo(data.systemInfo)
      }
    } catch (error) {
      console.error('Error loading system info:', error)
    }
  }

  const loadAvailableTables = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/system/tables', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAvailableTables(data.tables)
      }
    } catch (error) {
      console.error('Error loading tables:', error)
    }
  }

  const loadBackupHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/system/backup?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBackupHistory(data.backups)
      }
    } catch (error) {
      console.error('Error loading backup history:', error)
    }
  }

  const loadCacheHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/system/cache?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCacheHistory(data.cacheLogs)
      }
    } catch (error) {
      console.error('Error loading cache history:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBackupOptionChange = (field: keyof BackupOptions, value: any) => {
    setBackupOptions(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCacheOptionChange = (field: keyof CacheOptions, value: any) => {
    setCacheOptions(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess('System settings saved successfully!')
    } catch (err) {
      setError('Failed to save system settings')
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/system/cache', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cacheOptions)
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(`Cache cleared successfully! ${data.totalCleared} items cleared.`)
        setShowCacheModal(false)
        loadCacheHistory()
        loadSystemInfo()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to clear cache')
      }
    } catch (err) {
      setError('Failed to clear cache')
    } finally {
      setLoading(false)
    }
  }

  const handleBackupNow = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/system/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backupOptions)
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(`Backup created successfully! File: ${data.backup.filename}`)
        setShowBackupModal(false)
        loadBackupHistory()
        loadSystemInfo()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create backup')
      }
    } catch (err) {
      setError('Failed to create backup')
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreBackup = async (backupId: number) => {
    if (!confirm('Are you sure you want to restore this backup? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/system/backup/${backupId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess('Backup restored successfully!')
        loadBackupHistory()
        loadSystemInfo()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to restore backup')
      }
    } catch (err) {
      setError('Failed to restore backup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-600">Manage system backup and maintenance operations.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-8">
        {/* Backup Settings */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <DatabaseIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Backup Management</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                Automatic Backup Frequency
              </label>
              <select
                id="backupFrequency"
                name="backupFrequency"
                value={settings.backupFrequency}
                onChange={handleInputChange}
                className="text-black w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual Only</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Configure how often the system should automatically create backups
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowBackupModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <CloudIcon className="w-5 h-5" />
                Create Backup Now
              </button>
              
              <button
                onClick={() => setShowCacheModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <TrashIcon className="w-5 h-5" />
                Clear System Cache
              </button>
            </div>

            {/* Backup History */}
            {backupHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Recent Backups</h4>
                <div className="space-y-2">
                  {backupHistory.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${backup.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{backup.filename}</div>
                          <div className="text-xs text-gray-500">
                            {backup.backupType} • {new Date(backup.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{(backup.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cache History */}
            {cacheHistory.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Recent Cache Operations</h4>
                <div className="space-y-2">
                  {cacheHistory.map((cache) => (
                    <div key={cache.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <TrashIcon className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{cache.cacheType} cache cleared</div>
                          <div className="text-xs text-gray-500">
                            {cache.totalCleared} items • {new Date(cache.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <DocumentTextIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">System Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Application Version</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.application.version || 'v1.0.0'}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Database Version</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.database.version || 'MySQL (Unknown)'}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Server Uptime</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.system.uptime || 'Unknown'}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Last Backup</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.database.lastBackup 
                  ? new Date(systemInfo.database.lastBackup.createdAt).toLocaleString()
                  : 'No backups yet'
                }
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Storage Used</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.system.storage.used || 'Unknown'}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Available Space</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.system.storage.available || 'Unknown'}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Total Users</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.database.totalUsers || 0}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Total Messages</div>
              <div className="text-lg font-semibold text-gray-900">
                {systemInfo?.database.totalMessages || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Backup Settings'
            )}
          </button>
        </div>
      </div>

      {/* Backup Options Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Type</label>
                <select
                  value={backupOptions.backupType}
                  onChange={(e) => handleBackupOptionChange('backupType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full">Full Database Backup</option>
                  <option value="partial">Partial Backup (Core Tables)</option>
                  <option value="selective">Selective Backup (Choose Tables)</option>
                </select>
              </div>

              {backupOptions.backupType === 'selective' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Tables</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {availableTables.map((table) => (
                      <label key={table.name} className="flex items-center gap-2 p-1 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={backupOptions.tables.includes(table.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleBackupOptionChange('tables', [...backupOptions.tables, table.name])
                            } else {
                              handleBackupOptionChange('tables', backupOptions.tables.filter(t => t !== table.name))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{table.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Options</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={backupOptions.includeSchema}
                      onChange={(e) => handleBackupOptionChange('includeSchema', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Include Schema</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={backupOptions.includeData}
                      onChange={(e) => handleBackupOptionChange('includeData', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Include Data</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={backupOptions.description}
                  onChange={(e) => handleBackupOptionChange('description', e.target.value)}
                  placeholder="Enter backup description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBackupModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBackupNow}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Create Backup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cache Options Modal */}
      {showCacheModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cache Type</label>
                <select
                  value={cacheOptions.cacheType}
                  onChange={(e) => handleCacheOptionChange('cacheType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Caches</option>
                  <option value="database">Database Cache</option>
                  <option value="session">Session Cache</option>
                  <option value="file">File Cache</option>
                  <option value="memory">Memory Cache</option>
                  <option value="redis">Redis Cache</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clear All</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={cacheOptions.clearAll}
                    onChange={(e) => handleCacheOptionChange('clearAll', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Clear all cache types</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specific Keys (Optional)</label>
                <input
                  type="text"
                  value={cacheOptions.specificKeys.join(', ')}
                  onChange={(e) => handleCacheOptionChange('specificKeys', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                  placeholder="Enter cache keys separated by commas..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to clear all keys of selected type</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCacheModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCache}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Clearing...' : 'Clear Cache'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
