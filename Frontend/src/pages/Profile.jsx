import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Camera, Loader2, Check, AlertCircle, Plus, Trash2, ChevronDown, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { updateProfileThunk } from '../features/auth/authSlice'
import { INDIAN_BANKS, ACCOUNT_VALIDATION_RULES, IFSC_PATTERN, maskAccountNumber, optimizeImage, isValidBank } from '../data/bankData'

export default function Profile() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(s => s.auth)
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profileImage: user?.profileImage || '',
    bankName: user?.bankName || '',
    accountNumber: user?.accountNumber || '',
    ifscCode: user?.ifscCode || '',
  })

  const [imagePreview, setImagePreview] = useState(user?.profileImage || '')
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const fileInputRef = useRef(null)
  const bankDropdownRef = useRef(null)

  // Close bank dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target)) {
        setShowBankDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Filtered banks for dropdown
  const filteredBanks = INDIAN_BANKS.filter(bank =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  )

  // Validation rules
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters'

    if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone must be 10 digits'
    }

    // Validate account number if provided
    if (formData.accountNumber) {
      if (formData.accountNumber.length < ACCOUNT_VALIDATION_RULES.minLength) {
        newErrors.accountNumber = `Account number must be at least ${ACCOUNT_VALIDATION_RULES.minLength} digits`
      }
      if (formData.accountNumber.length > ACCOUNT_VALIDATION_RULES.maxLength) {
        newErrors.accountNumber = `Account number cannot exceed ${ACCOUNT_VALIDATION_RULES.maxLength} digits`
      }
      if (!ACCOUNT_VALIDATION_RULES.pattern.test(formData.accountNumber)) {
        newErrors.accountNumber = 'Account number must contain only digits'
      }
    }

    // Validate IFSC if provided
    if (formData.ifscCode && !IFSC_PATTERN.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code (format: AAAA0XXXXXX)'
    }

    // Validate bank name if account number is provided
    if (formData.accountNumber && !formData.bankName) {
      newErrors.bankName = 'Bank name is required when adding account number'
    }
    
    // Validate that selected bank is from the approved list
    if (formData.bankName && !isValidBank(formData.bankName)) {
      newErrors.bankName = 'Please select a valid bank from the list'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Handle image upload with optimization
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    try {
      toast.loading('Optimizing image...')
      const optimizedData = await optimizeImage(file)
      setImagePreview(optimizedData)
      setFormData(prev => ({ ...prev, profileImage: optimizedData }))
      toast.dismiss()
      toast.success('Image optimized and ready to save')
    } catch (error) {
      toast.error('Failed to process image')
    }
  }

  // Delete profile picture
  const handleDeleteProfilePicture = () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) return
    
    setImagePreview('')
    setFormData(prev => ({ ...prev, profileImage: '' }))
    toast.success('Profile picture removed (click Save to confirm)')
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await dispatch(updateProfileThunk(formData)).unwrap()
      toast.success('Profile updated successfully!')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      toast.error(error || 'Failed to update profile')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold gt">Profile Settings</h1>
        <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
          Manage your account information and preferences
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
          <Check size={20} className="text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">Your profile has been updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`gc p-6 rounded-2xl ${isLight ? 'border border-teal-100' : 'border border-white/[0.08]'}`}
        >
          <h2 className={`text-lg font-bold mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            Profile Picture
          </h2>

          <div className="flex items-center gap-6">
            {/* Avatar */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:opacity-90 transition-opacity shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera size={16} />
              </motion.button>
            </motion.div>

            <div className="flex-1">
              <h3 className={`font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {imagePreview ? 'Update Photo' : 'Upload Photo'}
              </h3>
              <p className={`text-sm mb-3 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                JPG, PNG or GIF, max 5MB
              </p>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                    isLight
                      ? 'border-teal-200 text-teal-600 hover:bg-teal-50'
                      : 'border-white/[0.08] text-gray-300 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={14} />
                  Choose File
                </motion.button>
                {imagePreview && (
                  <motion.button
                    type="button"
                    onClick={handleDeleteProfilePicture}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                      isLight
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={14} />
                    Remove
                  </motion.button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <div className={`gc p-6 rounded-2xl ${isLight ? 'border border-teal-100' : 'border border-white/[0.08]'}`}>
          <h2 className={`text-lg font-bold mb-4 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            Personal Information
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                  isLight
                    ? `border-teal-200 bg-white text-slate-800 focus:border-teal-400 focus:ring-teal-400/20 ${errors.name ? 'border-red-300 ring-1 ring-red-300' : ''}`
                    : `border-white/[0.08] bg-white/[0.04] text-white focus:border-teal-500/50 focus:ring-teal-500/30 ${errors.name ? 'border-red-500/50 ring-1 ring-red-500/30' : ''}`
                }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-not-allowed opacity-60 ${
                  isLight
                    ? 'border-teal-100 bg-teal-50 text-slate-600'
                    : 'border-white/[0.08] bg-white/[0.02] text-gray-500'
                }`}
              />
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit number"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                  isLight
                    ? `border-teal-200 bg-white text-slate-800 focus:border-teal-400 focus:ring-teal-400/20 placeholder-slate-400 ${errors.phoneNumber ? 'border-red-300 ring-1 ring-red-300' : ''}`
                    : `border-white/[0.08] bg-white/[0.04] text-white focus:border-teal-500/50 focus:ring-teal-500/30 placeholder-gray-600 ${errors.phoneNumber ? 'border-red-500/50 ring-1 ring-red-500/30' : ''}`
                }`}
              />
              {errors.phoneNumber && <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className={`gc p-6 rounded-2xl ${isLight ? 'border border-teal-100' : 'border border-white/[0.08]'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
              Bank Details
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isLight
                ? 'bg-amber-100 text-amber-700'
                : 'bg-amber-500/10 text-amber-300'
            }`}>
              <AlertCircle size={12} className="inline mr-1" />
              Optional
            </span>
          </div>

          <p className={`text-sm mb-4 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            Add your bank details to streamline future transactions (secured & encrypted)
          </p>

          <div className="space-y-4">
            {/* Bank Name Dropdown */}
            <div ref={bankDropdownRef} className="relative">
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Bank Name
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowBankDropdown(!showBankDropdown)
                    setBankSearch('')
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border outline-none transition-all ${
                    isLight
                      ? `border-teal-200 bg-white text-slate-800 focus:border-teal-400 focus:ring-teal-400/20 ${errors.bankName ? 'border-red-300 ring-1 ring-red-300' : ''}`
                      : `border-white/[0.08] bg-white/[0.04] text-white focus:border-teal-500/50 focus:ring-teal-500/30 ${errors.bankName ? 'border-red-500/50 ring-1 ring-red-500/30' : ''}`
                  }`}
                >
                  <span>{formData.bankName || 'Select a bank...'}</span>
                  <ChevronDown size={16} className={`transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showBankDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-full mt-2 left-0 right-0 z-50 rounded-xl border overflow-hidden max-h-64 overflow-y-auto ${
                      isLight
                        ? 'bg-white border-teal-200 shadow-lg'
                        : 'bg-[#0e0e1f] border-white/[0.08] shadow-2xl'
                    }`}
                  >
                    {/* Search input */}
                    <div className={`sticky top-0 p-2.5 ${isLight ? 'bg-teal-50 border-b border-teal-100' : 'bg-white/[0.02] border-b border-white/[0.08]'}`}>
                      <input
                        type="text"
                        value={bankSearch}
                        onChange={e => setBankSearch(e.target.value)}
                        placeholder="Search banks..."
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${
                          isLight
                            ? 'border-teal-200 bg-white text-slate-800'
                            : 'border-white/[0.08] bg-white/[0.04] text-white'
                        }`}
                      />
                    </div>

                    {/* Bank options */}
                    <div>
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map(bank => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, bankName: bank }))
                              setShowBankDropdown(false)
                              setBankSearch('')
                              if (errors.bankName) setErrors(prev => ({ ...prev, bankName: '' }))
                            }}
                            className={`w-full text-left px-4 py-2.5 transition-colors ${
                              formData.bankName === bank
                                ? isLight
                                  ? 'bg-teal-100 text-teal-700 font-semibold'
                                  : 'bg-teal-500/20 text-teal-300 font-semibold'
                                : isLight
                                  ? 'text-slate-700 hover:bg-teal-50'
                                  : 'text-gray-300 hover:bg-white/[0.05]'
                            }`}
                          >
                            {bank}
                            {formData.bankName === bank && <Check size={16} className="inline ml-2" />}
                          </button>
                        ))
                      ) : (
                        <div className={`px-4 py-3 text-center text-sm ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                          No banks found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
              {errors.bankName && <p className="text-red-400 text-xs mt-1">{errors.bankName}</p>}
            </div>

            {/* Account Number */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                Account Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={e => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '')
                  setFormData({ ...formData, accountNumber: value })
                  if (errors.accountNumber) setErrors({ ...errors, accountNumber: '' })
                }}
                placeholder="Enter account number (digits only)"
                maxLength={ACCOUNT_VALIDATION_RULES.maxLength}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${
                  isLight
                    ? `border-teal-200 bg-white text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400/20 ${errors.accountNumber ? 'border-red-300 ring-1 ring-red-300' : ''}`
                    : `border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 focus:border-teal-500/50 focus:ring-teal-500/30 ${errors.accountNumber ? 'border-red-500/50 ring-1 ring-red-500/30' : ''}`
                }`}
              />
              {formData.accountNumber && (
                <p className={`text-xs mt-2 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                  Masked: {maskAccountNumber(formData.accountNumber)}
                </p>
              )}
              {errors.accountNumber && <p className="text-red-400 text-xs mt-1">{errors.accountNumber}</p>}
            </div>

            {/* IFSC Code */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={e => {
                  setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })
                  if (errors.ifscCode) setErrors({ ...errors, ifscCode: '' })
                }}
                placeholder="e.g., HDFC0000123"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all uppercase ${
                  isLight
                    ? `border-teal-200 bg-white text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400/20 ${errors.ifscCode ? 'border-red-300 ring-1 ring-red-300' : ''}`
                    : `border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 focus:border-teal-500/50 focus:ring-teal-500/30 ${errors.ifscCode ? 'border-red-500/50 ring-1 ring-red-500/30' : ''}`
                }`}
              />
              {errors.ifscCode && <p className="text-red-400 text-xs mt-1">{errors.ifscCode}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl gb font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
