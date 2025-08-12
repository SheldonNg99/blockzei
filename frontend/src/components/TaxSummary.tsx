// frontend/src/components/TaxSummary.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calculator, FileText, DollarSign, Percent } from 'lucide-react';

interface TaxSummary {
  totalCapitalGains: number;
  totalCapitalLosses: number;
  netCapitalGains: number;
  totalFees: number;
  japanTaxOwed: number;
  events: Array<{
    date: string;
    pair: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    costBasis?: number;
    gainLoss?: number;
    fee: number;
  }>;
}

interface TaxSummaryProps {
  shouldRefresh?: boolean;
  onRefreshComplete?: () => void;
}

export default function TaxSummary({ shouldRefresh, onRefreshComplete }: TaxSummaryProps) {
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(2024);

  const fetchTaxSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/tax-summary?year=${year}`);
      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
      } else {
        setError('Failed to calculate taxes');
      }
    } catch (err) {
      setError('Network error');
      console.error('Tax calculation error:', err);
    } finally {
      setLoading(false);
      onRefreshComplete?.();
    }
  };

  useEffect(() => {
    fetchTaxSummary();
  }, [year]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchTaxSummary();
    }
  }, [shouldRefresh]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatYen = (amount: number) => {
    // Convert USD to JPY (approximate rate: 150 JPY = 1 USD)
    const jpy = amount * 150;
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(jpy);
  };

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/generate-report?year=${year}`);
      if (response.ok) {
        const htmlContent = await response.text();
        
        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crypto-tax-report-${year}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-red-600 text-center">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-red-300" />
          <p>{error}</p>
          <button 
            onClick={fetchTaxSummary}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Calculation
          </button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center text-gray-500">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Upload transactions to see tax calculation</p>
        </div>
      </div>
    );
  }

  const netGainLoss = summary.totalCapitalGains - summary.totalCapitalLosses;
  const isProfit = netGainLoss > 0;

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-blue-600" />
            Tax Summary
          </h2>
          <div className="flex items-center space-x-3">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
            {summary && (
              <button
                onClick={handleDownloadReport}
                className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                <FileText className="h-4 w-4 mr-1" />
                Download Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Capital Gains */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Capital Gains</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalCapitalGains)}
              </p>
            </div>
          </div>
        </div>

        {/* Capital Losses */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Capital Losses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalCapitalLosses)}
              </p>
            </div>
          </div>
        </div>

        {/* Net Gains/Losses */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <DollarSign className={`h-8 w-8 ${isProfit ? 'text-green-600' : 'text-red-600'}`} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Net P&L</p>
              <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netGainLoss)}
              </p>
            </div>
          </div>
        </div>

        {/* Japan Tax Owed */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <Percent className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Japan Tax (20%)</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatYen(summary.japanTaxOwed)}
              </p>
              <p className="text-xs text-gray-400">
                {formatCurrency(summary.japanTaxOwed)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Summary */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Tax Calculation Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Capital Gains:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(summary.totalCapitalGains)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Capital Losses:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(summary.totalCapitalLosses)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium text-gray-900">Net Capital Gains:</span>
              <span className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netGainLoss)}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Trading Fees:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(summary.totalFees)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax Rate (Japan):</span>
              <span className="font-medium text-gray-900">20%</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium text-gray-900">Estimated Tax Owed:</span>
              <span className="font-bold text-blue-600">
                {formatYen(summary.japanTaxOwed)}
              </span>
            </div>
          </div>
        </div>

        {/* Tax Filing Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Japan Tax Filing Notes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Crypto gains are treated as miscellaneous income in Japan</li>
            <li>• Progressive tax rates apply (5% - 45% + 10% local tax)</li>
            <li>• This calculation uses simplified 20% rate for estimation</li>
            <li>• Consult a tax professional for accurate filing</li>
            <li>• Filing deadline: March 15th following tax year</li>
          </ul>
        </div>
      </div>
    </div>
  );
}