import React, { useState, useEffect } from 'react'
import { companiesAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Mail, 
  Calendar,
  X,
  Check
} from 'lucide-react'

interface Company {
  _id: string
  name: string
  domains: string[]
  description?: string
  contactEmail?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CompanyForm {
  name: string
  domains: string
  description: string
  contactEmail: string
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CompanyForm>()

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const response = await companiesAPI.getAllCompanies()
      if (response.data.success) {
        setCompanies(response.data.data.companies)
      }
    } catch (error: any) {
      toast.error('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company)
      setValue('name', company.name)
      setValue('domains', company.domains.join(', '))
      setValue('description', company.description || '')
      setValue('contactEmail', company.contactEmail || '')
    } else {
      setEditingCompany(null)
      reset()
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCompany(null)
    reset()
  }

  const onSubmit = async (data: CompanyForm) => {
    setSubmitting(true)
    try {
      const companyData = {
        name: data.name,
        domains: data.domains.split(',').map(d => d.trim()).filter(d => d),
        description: data.description,
        contactEmail: data.contactEmail
      }

      if (editingCompany) {
        await companiesAPI.updateCompany(editingCompany._id, companyData)
        toast.success('Company updated successfully')
      } else {
        await companiesAPI.createCompany(companyData)
        toast.success('Company created successfully')
      }
      
      closeModal()
      loadCompanies()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCompanyStatus = async (company: Company) => {
    try {
      await companiesAPI.updateCompany(company._id, { isActive: !company.isActive })
      toast.success(`Company ${company.isActive ? 'deactivated' : 'activated'} successfully`)
      loadCompanies()
    } catch (error: any) {
      toast.error('Failed to update company status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Companies Management</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company._id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  <div className="flex items-center mt-1">
                    {company.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(company)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleCompanyStatus(company)}
                  className={`p-2 rounded-lg transition-colors ${
                    company.isActive 
                      ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                      : 'text-green-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {company.isActive ? <Trash2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {company.description && (
              <p className="text-sm text-gray-600 mb-4">{company.description}</p>
            )}

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Globe className="w-4 h-4 mr-2" />
                <span>{company.domains.length} domain{company.domains.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {company.domains.map((domain, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {domain}
                  </span>
                ))}
              </div>
              
              {company.contactEmail && (
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{company.contactEmail}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Created {new Date(company.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
          <button onClick={() => openModal()} className="mt-4 btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingCompany ? 'Edit Company' : 'Add New Company'}
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        {...register('name', { required: 'Company name is required' })}
                        className="input-field"
                        placeholder="Enter company name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domains * (comma-separated)
                      </label>
                      <input
                        {...register('domains', { required: 'At least one domain is required' })}
                        className="input-field"
                        placeholder="example.com, example.org"
                      />
                      {errors.domains && (
                        <p className="mt-1 text-sm text-red-600">{errors.domains.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Enter multiple domains separated by commas
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        className="input-field"
                        placeholder="Company description (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        {...register('contactEmail', {
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className="input-field"
                        placeholder="contact@company.com (optional)"
                      />
                      {errors.contactEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex justify-center btn-primary sm:ml-3 sm:w-auto disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingCompany ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      editingCompany ? 'Update Company' : 'Create Company'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center btn-secondary sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}