// frontend/src/components/TransactionTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  pair: string;
  side: string;
  amount: number;
  price: number;
  fee: number;
  feeCoin: string;
  realizedPnl: number | null;
}

interface TransactionTableProps {
  shouldRefresh?: boolean;
  onRefreshComplete?: () => void;
}

export default function TransactionTable({ shouldRefresh, onRefreshComplete }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      setError('Network error');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      onRefreshComplete?.();
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      fetchTransactions();
    }
  }, [shouldRefresh]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number, decimals: number = 4) => {
    return num.toFixed(decimals);
  };

  const getSideIcon = (side: string) => {
    return side === 'BUY' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getSideColor = (side: string) => {
    return side === 'BUY' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={fetchTransactions}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No transactions found. Upload a CSV file to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
          Transactions ({transactions.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pair
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Side
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value (USDT)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {transaction.pair}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center space-x-1 ${getSideColor(transaction.side)}`}>
                    {getSideIcon(transaction.side)}
                    <span className="text-sm font-medium">
                      {transaction.side}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatNumber(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${formatNumber(transaction.price, 2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  ${formatNumber(transaction.amount * transaction.price, 2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {formatNumber(transaction.fee, 4)} {transaction.feeCoin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Transactions: {transactions.length}</span>
          <span>
            Total Value: ${transactions.reduce((sum, t) => sum + (t.amount * t.price), 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}