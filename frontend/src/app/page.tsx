// frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Calculator, CheckCircle } from 'lucide-react';
import TransactionTable from '../components/TransactionTable';
import TaxSummary from '../components/TaxSummary';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null); // Clear previous results
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setRefreshTable(true); // Trigger table refresh
        console.log('Upload successful:', data);
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        setResult({ error: errorData.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Network error occurred' });
    } finally {
      setUploading(false);
    }
  };

  const handleTableRefreshComplete = () => {
    setRefreshTable(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Calculator className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            Crypto Tax Calculator
          </h1>
          <p className="mt-2 text-gray-600">
            Upload your Binance CSV to calculate your crypto taxes for Japan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Upload CSV File
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Binance CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {file && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                    <span className="text-gray-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Processing...' : 'Upload & Process'}
                </button>
              </div>

              {/* Upload Result */}
              {result && (
                <div className="mt-6">
                  {result.error ? (
                    <div className="p-4 bg-red-50 rounded-md">
                      <h3 className="text-sm font-medium text-red-800">
                        Upload Failed
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {result.error}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-sm font-medium text-green-800">
                          Upload Successful!
                        </h3>
                      </div>
                      <div className="mt-2 text-sm text-green-700 space-y-1">
                        <p>File: {result.originalName}</p>
                        <p>Transactions processed: {result.transactionsCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              <div className="mt-6 text-xs text-gray-500 space-y-2">
                <h4 className="font-medium text-gray-700">Supported formats:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Binance Spot Trading History CSV</li>
                  <li>Must include: Date, Pair, Side, Amount, Price</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Tax Summary */}
              <TaxSummary 
                shouldRefresh={refreshTable}
                onRefreshComplete={handleTableRefreshComplete}
              />

              {/* Transaction Table */}
              <TransactionTable 
                shouldRefresh={refreshTable}
                onRefreshComplete={handleTableRefreshComplete}
              />
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Coming Next
            </h3>
            <p className="text-blue-700">
              Tax calculation with FIFO/LIFO methods, capital gains analysis, 
              and PDF report generation for Japanese tax filing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}