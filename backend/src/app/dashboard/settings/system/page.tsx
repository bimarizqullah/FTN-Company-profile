'use client'

import { useState } from 'react'
import { 
  CircleStackIcon as DatabaseIcon,
  CloudIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface SystemSettings {
  backupFrequency: string
}

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<SystemSettings>({
    backupFrequency: 'daily'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value
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
    try {
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Cache cleared successfully!')
    } catch (err) {
      setError('Failed to clear cache')
    }
  }

  const handleBackupNow = async () => {
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess('Backup created successfully!')
    } catch (err) {
      setError('Failed to create backup')
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
                className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                onClick={handleBackupNow}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <CloudIcon className="w-5 h-5" />
                Create Backup Now
              </button>
              
              <button
                onClick={handleClearCache}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <TrashIcon className="w-5 h-5" />
                Clear System Cache
              </button>
            </div>
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
              <div className="text-lg font-semibold text-gray-900">v1.0.0</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Database Version</div>
              <div className="text-lg font-semibold text-gray-900">PostgreSQL 15.3</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Server Uptime</div>
              <div className="text-lg font-semibold text-gray-900">7 days, 14 hours</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Last Backup</div>
              <div className="text-lg font-semibold text-gray-900">2 hours ago</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Storage Used</div>
              <div className="text-lg font-semibold text-gray-900">2.4 GB</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Available Space</div>
              <div className="text-lg font-semibold text-gray-900">47.6 GB</div>
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
    </div>
  )
}
