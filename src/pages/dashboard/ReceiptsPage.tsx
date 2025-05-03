import React, { useState, useEffect } from 'react';
import { Receipt as ReceiptIcon, Download, Eye, AlertCircle } from 'lucide-react';
import { subscriptionApi } from '../../api/subscriptions';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Receipt {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: string;
  receiptNumber: string;
  subscriptionName: string;
  createdAt: string;
}

const ReceiptsPage = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setError(null);
      const response = await subscriptionApi.getUserReceipts();
      if (response.status === 'success') {
        setReceipts(response.data);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleDownloadReceipt = (receipt: Receipt) => {
    // Create PDF content
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #005555; }
            .receipt-box { border: 1px solid #ddd; padding: 20px; }
            .receipt-number { color: #666; margin-bottom: 20px; }
            .details { margin-bottom: 30px; }
            .amount { font-size: 20px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Guardget</div>
            <p>Official Receipt</p>
          </div>
          <div class="receipt-box">
            <div class="receipt-number">
              Receipt #: ${receipt.receiptNumber}
            </div>
            <div class="details">
              <p><strong>Date:</strong> ${format(new Date(receipt.date), 'MMMM dd, yyyy')}</p>
              <p><strong>Subscription:</strong> ${receipt.subscriptionName}</p>
              <p><strong>Description:</strong> ${receipt.description}</p>
              <p><strong>Status:</strong> ${receipt.status}</p>
            </div>
            <div class="amount">
              Amount Paid: ₦${receipt.amount.toLocaleString()}
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing Guardget!</p>
            <p>For support, contact: support@guardget.com</p>
          </div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receipt.receiptNumber}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success('Receipt downloaded successfully');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error bg-opacity-10 text-error rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ReceiptIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment History</h1>
          <p className="text-gray-600 dark:text-gray-300">View and download your payment receipts</p>
        </div>
      </div>

      {receipts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">No receipts found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Receipt Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {format(new Date(receipt.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {receipt.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {receipt.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewReceipt(receipt)}
                        className="text-primary hover:text-primary-dark mr-3"
                        title="View Receipt"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadReceipt(receipt)}
                        className="text-primary hover:text-primary-dark"
                        title="Download Receipt"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receipt Details Modal */}
      {isModalOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Receipt Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receipt Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedReceipt.receiptNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(selectedReceipt.date), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ₦{selectedReceipt.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedReceipt.status === 'completed'
                      ? 'bg-success bg-opacity-10 text-success'
                      : 'bg-warning bg-opacity-10 text-warning'
                  }`}>
                    {selectedReceipt.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedReceipt.description}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => handleDownloadReceipt(selectedReceipt)}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptsPage;