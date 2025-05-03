import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Smartphone, Receipt, TrendingUp, ChevronRight } from 'lucide-react';
import { adminApi, AdminDashboardStats } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      if (response.status === 'success') {
        setStats(response.data);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
      <div className="bg-error bg-opacity-10 text-error p-4 rounded-md">
        <p>{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="mt-2 text-sm font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor your platform's performance and user activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                {stats.users.total}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-success">
              {stats.users.active} Active Users
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-warning bg-opacity-10 p-3 rounded-full mr-4">
              <Smartphone className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Devices</p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                {stats.devices.total}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-1">
              {stats.devices.byType.map(type => (
                <p key={type._id} className="text-sm text-gray-500 dark:text-gray-400">
                  {type.count} {type._id}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-success bg-opacity-10 p-3 rounded-full mr-4">
              <Receipt className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                ₦{stats.receipts.revenue.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-success">
              {stats.receipts.total} Total Transactions
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="bg-error bg-opacity-10 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Subscription Tiers</p>
              <h3 className="text-2xl font-bold text-secondary dark:text-white">
                {stats.users.subscriptionTiers.length}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            {stats.users.subscriptionTiers.map(tier => (
              <p key={tier._id} className="text-sm text-gray-500 dark:text-gray-400">
                {tier._id}: {tier.count} users
              </p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.users.recent.map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </span>
                    <p className={`text-sm ${
                      user.subscriptionStatus === 'Active' ? 'text-success' : 'text-warning'
                    }`}>
                      {user.subscriptionStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Devices</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.devices.recent.map((device) => (
                <div key={device._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-warning bg-opacity-10 p-2 rounded-full">
                      <Smartphone className="h-5 w-5 text-warning" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {device.status}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(device.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;