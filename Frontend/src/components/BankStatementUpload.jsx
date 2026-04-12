/**
 * 📁 Bank Statement Upload Component
 * 
 * Complete working component for file upload
 * Supports: CSV, PDF, TXT files
 * 
 * Usage:
 * <BankStatementUpload />
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';

const BankStatementUpload = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Local state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [progress, setProgress] = useState(0);

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    const validTypes = ['.csv', '.pdf', '.txt'];
    const fileName = selectedFile.name.toLowerCase();
    const isValidType = validTypes.some(type => fileName.endsWith(type));
    
    if (!isValidType) {
      setUploadStatus({
        type: 'error',
        message: 'Only CSV, PDF, and TXT files are allowed'
      });
      return;
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      setUploadStatus({
        type: 'error',
        message: 'File size exceeds 100MB limit'
      });
      return;
    }

    setFile(selectedFile);
    setUploadStatus(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file first'
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Make API request
      const response = await axiosInstance.post(
        '/transactions/upload-csv',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(percentComplete);
          }
        }
      );

      // Success
      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${response.data.count} transactions from ${response.data.format.toUpperCase()}`
      });

      // Refresh transactions in Redux
      dispatch(fetchTransactions());

      // Reset file
      setFile(null);
      setProgress(0);

      // Clear file input
      document.getElementById('file-input').value = '';

    } catch (error) {
      // Error
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      setUploadStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    const event = {
      target: { files: [droppedFile] }
    };
    handleFileSelect(event);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📁 Import Bank Statement
        </h2>
        <p className="text-gray-600">
          Upload a CSV, PDF, or TXT bank statement to auto-import transactions
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition cursor-pointer mb-6"
      >
        <input
          id="file-input"
          type="file"
          accept=".csv,.pdf,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        <label htmlFor="file-input" className="cursor-pointer">
          <div className="mb-3 text-4xl">📤</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {file ? file.name : 'Drag & drop your file here'}
          </h3>
          <p className="text-gray-600 mb-4">
            or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: CSV • PDF • TXT (Max 100MB)
          </p>
        </label>
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                document.getElementById('file-input').value = '';
              }}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              ✕ Remove
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {uploading && progress > 0 && (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Uploading...
            </span>
            <span className="text-sm font-medium text-gray-700">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Messages */}
      {uploadStatus && (
        <div
          className={`rounded-lg p-4 mb-6 ${
            uploadStatus.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p
            className={`${
              uploadStatus.type === 'success'
                ? 'text-green-800'
                : 'text-red-800'
            }`}
          >
            {uploadStatus.type === 'success' ? '✅' : '❌'} {uploadStatus.message}
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${
            file && !uploading
              ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {uploading ? '⏳ Uploading...' : '🚀 Upload & Import'}
        </button>

        <button
          onClick={() => {
            setFile(null);
            setUploadStatus(null);
            setProgress(0);
            document.getElementById('file-input').value = '';
          }}
          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">
          📋 Supported Formats
        </h3>
        
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-700">CSV Format:</p>
            <pre className="bg-gray-100 p-2 rounded text-gray-600 overflow-x-auto">
{`Date,Description,Amount
2024-04-03,Salary,50000
2024-04-04,Food,-500`}
            </pre>
          </div>

          <div>
            <p className="font-medium text-gray-700">PDF:</p>
            <p className="text-gray-600">
              Standard bank statement PDF (auto text extraction)
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-700">TXT:</p>
            <pre className="bg-gray-100 p-2 rounded text-gray-600 overflow-x-auto">
{`Date | Description | Debit | Credit
03/04 | Salary | | 50000
04/04 | Food | 500 |`}
            </pre>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">✨ Features</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ Auto-detects file format</li>
          <li>✅ AI-powered transaction extraction</li>
          <li>✅ Auto-categorization (Salary, Food, etc.)</li>
          <li>✅ Handles any date format</li>
          <li>✅ Instant dashboard update</li>
        </ul>
      </div>
    </div>
  );
};

export default BankStatementUpload;

// ============================================
// REDUX ACTION (for reference)
// ============================================

/*
// File: /Frontend/features/transactions/transactionsSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Fetch transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/transactions', { params });
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default transactionsSlice.reducer;
*/

/*
// Usage in component:
import { useDispatch } from 'react-redux';
import { fetchTransactions } from '../features/transactions/transactionsSlice';

function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, []);
}
*/
