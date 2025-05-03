import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, X, AlertCircle, Search } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { apiClient } from '../../api/client';

interface TransferRequest {
  _id: string;
  deviceId: string;
  deviceName: string;
  fromUser: {
    _id: string;
    username: string;
    email: string;
  };
  toUser: {
    _id: string;
    username: string;
    email: string;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminTransfersPage = () => {
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      // This would be replaced with your actual API endpoint
      const response = await apiClient.get('/admin/device-transfers');
      
      if (response.data.status === 'success') {
        setTransfers(response.data.data);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transferId: string) => {
    try {
      const response = await apiClient.post(`/admin/device-transfers/${transferId}/approve`);
      if (response.data.status === 'success') {
        toast.success('Transfer request approved successfully');
        fetchTransfers();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReject = async (transferId: string) => {
    try {
      const response = await apiClient.post(`/admin/device-transfers/${transferId}/reject`);
      if (response.data.status === 'success') {
        toast.success('Transfer request rejected successfully');
        fetchTransfers();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch = 
      transfer.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromUser.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toUser.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || transfer.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-warning bg-opacity-10 text-warning">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-success bg-opacity-10 text-success">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-error bg-opacity-10 text-error">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Send className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Device Transfer Requests</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and approve device ownership transfer requests
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
                placeholder="Search by device or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-error bg-opacity-10 text-error p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredTransfers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No transfer requests found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTransfers.map((transfer) => (
            <motion.div
              key={transfer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {transfer.deviceName}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">From:</span> {transfer.fromUser.username} ({transfer.fromUser.email})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">To:</span> {transfer.toUser.username} ({transfer.toUser.email})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Reason:</span> {transfer.reason}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Requested on {format(new Date(transfer.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  {getStatusBadge(transfer.status)}
                  {transfer.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(transfer._id)}
                        className="p-2 bg-success bg-opacity-10 text-success rounded-full hover:bg-opacity-20 transition-colors"
                        title="Approve Transfer"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(transfer._id)}
                        className="p-2 bg-error bg-opacity-10 text-error rounded-full hover:bg-opacity-20 transition-colors"
                        title="Reject Transfer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTransfersPage;