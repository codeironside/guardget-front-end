import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Download, Search, Calendar, AlertCircle } from 'lucide-react';
import { adminApi } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';

interface Receipt {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    username: string;
    phoneNumber: string;
    email: string;
    subscriptionStatus: string;
  };
  formattedDate: string;
}

const AdminReceiptsPage = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchReceipts();
  }, [pagination.page, dateRange]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllReceipts({
        page: pagination.page,
        limit: pagination.limit,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
      });

      if (response.status === 'success') {
        setReceipts(response.data);
        setPagination(response.pagination);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (receipt: Receipt) => {
    try {
      // Create receipt HTML content
      const content = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .receipt-details { margin-bottom: 20px; }
              .amount { font-size: 24px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Payment Receipt</h1>
              <p>Receipt #${receipt._id}</p>
            </div>
            <div class="receipt-details">
              <p><strong>Date:</strong> ${receipt.formattedDate}</p>
              <p><strong>User:</strong> ${receipt.user.username}</p>
              <p><strong>Email:</strong> ${receipt.user.email}</p>
              <p><strong>Status:</strong> ${receipt.status}</p>
            </div>
            <div class="amount">
              Amount Paid: ₦${receipt.amount.toLocaleString()}
            </div>
          </body>
        </html>
      `;

      // Create blob and trigger download
      const blob = new Blob([content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${receipt._id}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const filteredReceipts = receipts.filter((receipt) => {
    if (!searchTerm) return true;
    return (
      receipt.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt._id.includes(searchTerm)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Receipt className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Receipts</h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all payment transactions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or receipt ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-error bg-opacity-10 text-error p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Receipt ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <LoadingSpinner size="lg" />
                  </td>
                </tr>
              ) : filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No receipts found
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((receipt) => (
                  <tr
                    key={receipt._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {receipt._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {receipt.user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {receipt.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₦{receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        receipt.status === 'completed'
                          ? 'bg-success bg-opacity-10 text-success'
                          : 'bg-warning bg-opacity-10 text-warning'
                      }`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {receipt.formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDownload(receipt)}
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredReceipts.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReceiptsPage;