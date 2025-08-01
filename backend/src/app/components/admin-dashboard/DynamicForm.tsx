'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'checkbox-list' | 'select' | 'customText';
  placeholder?: string;
  required?: boolean;
  value: any;
  fetchUrl?: string;
  displayField?: string;
  descriptionField?: string;
  valueField?: string;
  readOnly?: boolean;
  options?: { value: string; display: string }[];
  validation?: (value: any) => string | null;
};

export type FormConfig = {
  title: string;
  description: string;
  fields: FormField[];
  submitUrl: string;
  submitMethod: 'POST' | 'PUT';
  redirectUrl: string;
  validate?: (data: { [key: string]: any }) => string | null;
};

type Props = {
  config: FormConfig
  error: string
  success: string
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export default function DynamicForm({ config, error, success, onSuccess, onError }: Props) {
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [listData, setListData] = useState<{ [key: string]: any[] }>({})
  const router = useRouter()

  useEffect(() => {
    // Initialize form data from config
    const initialData: { [key: string]: any } = {}
    config.fields.forEach((field) => {
      initialData[field.name] = field.value
      if ((field.type === 'checkbox-list' || field.type === 'select') && field.fetchUrl) {
        fetchListData(field)
      }
    })
    setFormData(initialData)
  }, [config])

  async function fetchListData(field: FormField) {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const res = await fetch(field.fetchUrl!, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token')
        }
        throw new Error(`Failed to fetch ${field.name}: ${res.statusText}`)
      }
      const data = await res.json()
      setListData((prev) => ({ ...prev, [field.name]: data }))
    } catch (err) {
      console.error(`Error fetching ${field.name}:`, err)
      onError(err instanceof Error ? err.message : `Gagal memuat ${field.name}`)
    }
  }

  function handleInputChange(name: string, value: any) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function toggleCheckbox(name: string, value: any) {
    setFormData((prev) => {
      const currentValues = prev[name] || []
      return {
        ...prev,
        [name]: currentValues.includes(value)
          ? currentValues.filter((v: any) => v !== value)
          : [...currentValues, value],
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // ✅ PERBAIKAN: Pastikan semua field dikirim, termasuk yang readOnly
      const payload: { [key: string]: any } = {};
      
      config.fields.forEach((field) => {
        // Ambil nilai dari formData, pastikan tidak undefined
        let value = formData[field.name];
        
        // Untuk select field, pastikan value adalah number jika valueField adalah id
        if (field.type === 'select' && field.valueField === 'id' && value !== undefined && value !== null) {
          value = Number(value);
        }
        
        // Sertakan semua field, termasuk yang readOnly
        payload[field.name] = value;
      });

      // Validasi per field
      for (const field of config.fields) {
        if (field.required && (payload[field.name] === undefined || payload[field.name] === null || payload[field.name] === '')) {
          throw new Error(`${field.label} wajib diisi`);
        }
        if (field.validation) {
          const error = field.validation(payload[field.name]);
          if (error) throw new Error(error);
        }
      }

      // Validasi global jika ada
      if (config.validate) {
        const globalError = config.validate(payload);
        if (globalError) throw new Error(globalError);
      }

      console.log('Submitting payload:', payload);
      console.log('Submit URL:', config.submitUrl);

      const response = await axios({
        method: config.submitMethod,
        url: config.submitUrl,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);
      onSuccess(config.submitMethod === 'PUT' ? 'Data berhasil diperbarui!' : 'Data berhasil dibuat!');
    } catch (err: any) {
      console.error('Error submitting form:', err.response?.data || err.message);
      onError(err.response?.data?.message || err.message || 'Gagal menyimpan perubahan');
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{config.title}</h1>
                <p className="text-sm text-gray-500">{config.description}</p>
              </div>
            </div>
            <button
              onClick={() => router.push(config.redirectUrl)}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="px-6 py-3 bg-cyan-50 border-b border-cyan-200">
            <p className="text-sm text-cyan-600">{success}</p>
          </div>
        )}

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-3">{field.label}</label>
                {field.type === 'text' ? (
                  field.readOnly ? (
                    <div>
                      <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border">
                        {formData[field.name] || '-'}
                      </p>
                      {/* Hidden input untuk memastikan nilai dikirim */}
                      <input
                        type="hidden"
                        value={formData[field.name] || ''}
                        name={field.name}
                      />
                    </div>
                  ) : (
                    <input
                      type={field.name === 'password' ? 'password' : 'text'}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )
                ) : field.type === 'select' ? (
                  field.readOnly ? (
                    <div>
                      <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border">
                        {field.options
                          ? field.options.find((item) => item.value === formData[field.name])?.display || '-'
                          : listData[field.name]?.find((item: any) => item[field.valueField!] === formData[field.name])?.[field.displayField!] || '-'}
                      </p>
                      {/* Hidden input untuk memastikan nilai dikirim */}
                      <input
                        type="hidden"
                        value={formData[field.name] || ''}
                        name={field.name}
                      />
                    </div>
                  ) : (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange(field.name, field.valueField === 'id' ? Number(value) : value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required={field.required}
                    >
                      <option value="" disabled>
                        {field.placeholder || 'Pilih opsi'}
                      </option>
                      {field.options
                        ? field.options.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.display}
                            </option>
                          ))
                        : listData[field.name]?.map((item: any) => (
                            <option key={item[field.valueField!]} value={item[field.valueField!]}>
                              {item[field.displayField!]}
                            </option>
                          ))}
                    </select>
                  )
                ) : field.type === 'checkbox-list' && listData[field.name] ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {listData[field.name].map((item: any) => (
                      <label
                        key={item[field.valueField!]}
                        className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData[field.name]?.includes(item[field.valueField!])}
                          onChange={() => toggleCheckbox(field.name, item[field.valueField!])}
                          disabled={field.readOnly}
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 mr-2">
                              {item[field.displayField!]}
                            </span>
                          </div>
                          {item[field.descriptionField!] && (
                            <p className="text-sm text-gray-500 mt-1">{item[field.descriptionField!]}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">© 2024 Admin Dashboard. Hak cipta dilindungi.</p>
      </div>
    </>
  )
}