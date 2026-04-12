import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadCSV, getCSVSample } from '../../utils/api'
import { fetchTransactions } from '../../features/transactions/transactionsSlice'
import { X, Upload, Download, AlertCircle, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CSVUploadModal({ onClose }) {
  const dispatch = useDispatch()
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type (CSV, PDF, TXT)
    const ext = selectedFile.name.split('.').pop().toLowerCase()
    if (!['csv', 'pdf', 'txt'].includes(ext)) {
      setError('Only CSV, PDF, and TXT files are allowed')
      toast.error('Only CSV, PDF, and TXT files are allowed')
      return
    }

    // Validate file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB')
      toast.error('File size must be less than 100MB')
      return
    }

    setFile(selectedFile)
    setError('')

    // Preview first few lines
    const reader = new FileReader()
    reader.onload = (evt) => {
      const content = evt.target.result
      const lines = content.split('\n').slice(0, 6) // First 6 lines including header
      setPreview(lines.join('\n'))
    }
    reader.readAsText(selectedFile)
  }

  const handleDownloadSample = async () => {
    try {
      const csv = await getCSVSample()
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'sample-transactions.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Sample CSV downloaded!')
    } catch (err) {
      toast.error(err.message || 'Failed to download sample')
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a CSV, PDF, or TXT file')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await uploadCSV(file)

      // Reload transactions
      await dispatch(fetchTransactions({ page: 1, limit: 20 }))

      setSuccess(true)
      setUploadResult({
        count: response.count,
        message: response.message
      })

      toast.success(`✅ Uploaded ${response.count} transactions!`)

      // Auto close after 3 seconds
      setTimeout(() => onClose(), 3000)
    } catch (err) {
      const errorMsg = err.message || 'Failed to upload CSV'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border p-6 space-y-5 ${
          isLight
            ? 'bg-white border-teal-200 shadow-2xl shadow-teal-100/40'
            : 'border-white/[0.08]'
        }`}
        style={isLight ? {} : {
          background: 'rgba(13,13,26,0.97)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(20,184,166,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold gt flex items-center gap-2">
              <Upload size={20} />
              Upload Bank Statement
            </h2>
            <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Import transactions from CSV, PDF, or TXT bank statement
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isLight
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.06]'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {success && uploadResult ? (
          // Success state
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
              <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-300">{uploadResult.message}</p>
                <p className={`text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                  {uploadResult.count} {uploadResult.count === 1 ? 'transaction' : 'transactions'} imported successfully
                </p>
              </div>
            </div>
            <p className={`text-sm text-center ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Closing in 3 seconds...
            </p>
          </div>
        ) : (
          // Upload form
          <div className="space-y-4">
            {/* Error */}
            {error && (
              <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                isLight
                  ? 'bg-red-50 border-red-200'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <AlertCircle size={18} className={`flex-shrink-0 mt-0.5 ${
                  isLight ? 'text-red-600' : 'text-red-400'
                }`} />
                <p className={isLight ? 'text-red-700 text-sm' : 'text-red-300 text-sm'}>
                  {error}
                </p>
              </div>
            )}

            {/* File upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isLight
                  ? file
                    ? 'border-green-300 bg-green-50'
                    : 'border-teal-300 bg-teal-50 hover:border-teal-400'
                  : file
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-teal-500/30 bg-teal-500/5 hover:border-teal-500/50'
              }`}
            >
              <Upload size={32} className={`mx-auto mb-3 ${
                isLight
                  ? file ? 'text-green-600' : 'text-teal-600'
                  : file ? 'text-green-400' : 'text-teal-400'
              }`} />
              
              {file ? (
                <div>
                  <p className={`font-semibold ${isLight ? 'text-green-700' : 'text-green-300'}`}>
                    {file.name}
                  </p>
                  <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    Drop CSV, PDF, or TXT file here or click to browse
                  </p>
                  <p className={`text-sm mt-1 ${isLight ? ' text-slate-500' : 'text-gray-400'}`}>
                    Max 100MB, CSV/PDF/TXT format
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.pdf,.txt,text/csv,application/pdf,text/plain"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Expected format */}
            <div className={`p-4 rounded-xl border ${
              isLight
                ? 'border-teal-100 bg-teal-50'
                : 'border-teal-500/20 bg-teal-500/5'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${isLight ? 'text-teal-700' : 'text-teal-300'}`}>
                📋 Supported Formats
              </p>
              
              {/* CSV Format */}
              <details className={`mb-3 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                <summary className="cursor-pointer font-medium text-sm">📄 CSV Format</summary>
                <pre className={`text-xs mt-2 p-3 rounded border overflow-x-auto ${
                  isLight ? 'bg-white border-teal-100 text-slate-700' : 'bg-white/[0.02] border-white/[0.08] text-gray-300'
                }`}>
{`Date,Description,Amount
2024-01-15,Salary Credited,50000
2024-01-16,Amazon Purchase,-1500
2024-01-17,Coffee,-200`}
                </pre>
                <p className={`text-xs mt-2 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                  • Use YYYY-MM-DD date format<br/>
                  • Amount: positive for income, negative for expense<br/>
                  • Columns: Date, Description, Amount
                </p>
              </details>
              
              {/* PDF Format */}
              <details className={`mb-3 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                <summary className="cursor-pointer font-medium text-sm">📕 PDF Format</summary>
                <p className={`text-xs mt-2 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                  Bank statement PDFs with Date, Description, and Amount columns
                </p>
              </details>
              
              {/* TXT Format */}
              <details className={`mb-3 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                <summary className="cursor-pointer font-medium text-sm">📜 TXT Format (Bank Statement)</summary>
                <p className={`text-xs mt-2 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                  Export your bank statement as text file with:<br/>
                  • Date (DD/MM/YYYY)<br/>
                  • Description/Narration<br/>
                  • Debit/Credit Amount<br/>
                  Supports table format with pipes (|) or tab-separated
                </p>
              </details>
            </div>

            {/* Preview */}
            {preview && (
              <div className={`p-4 rounded-xl border ${
                isLight
                  ? 'border-teal-100 bg-white'
                  : 'border-white/[0.08] bg-white/[0.02]'
              }`}>
                <p className={`text-sm font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Preview
                </p>
                <pre className={`text-xs overflow-x-auto p-3 rounded border ${
                  isLight
                    ? 'bg-slate-50 border-teal-100 text-slate-700'
                    : 'bg-white/[0.02] border-white/[0.08] text-gray-300'
                }`}>
                  {preview}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/[0.1]">
              <button
                onClick={handleDownloadSample}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isLight
                    ? 'border-teal-200 bg-white text-teal-600 hover:border-teal-400 hover:bg-teal-50'
                    : 'border-teal-500/30 bg-teal-500/5 text-teal-300 hover:border-teal-500/50 hover:bg-teal-500/10'
                }`}
              >
                <Download size={16} />
                Download Sample
              </button>
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isLight
                    ? 'border-teal-200 bg-white text-slate-600 hover:border-teal-400'
                    : 'border-white/[0.08] bg-white/[0.04] text-gray-300 hover:border-white/20'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl gb text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload CSV
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
