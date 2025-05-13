import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Edit, Trash, AlertCircle, X } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';
import { apiClient } from '../../api/client';
import toast from 'react-hot-toast';

interface Subscription {
  _id: string;
  name: string;
  NoOfDevices: number;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionFormData {
  name: string;
  NoOfDevices: number;
  price: number;
  description?: string;
}

const AdminSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    NoOfDevices: 1,
    price: 0,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/subscription/getallSubscription");
      
      if (response.data.status === 'success') {
        setSubscriptions(response.data.data);
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = () => {
    setSelectedSubscription(null);
    setFormData({
      name: '',
      NoOfDevices: 1,
      price: 0,
      description: '',
    });
    setShowCreateModal(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      name: subscription.name,
      NoOfDevices: subscription.NoOfDevices,
      price: subscription.price,
      description: subscription.description,
    });
    setShowCreateModal(true);
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return;

    try {
      const response = await apiClient.delete(`/subscription/deleteSubscription/${id}`);
      if (response.data.status === 'success') {
        toast.success('Subscription plan deleted successfully');
        fetchSubscriptions();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedSubscription) {
        // Update existing subscription
        const response = await apiClient.put(
          `/subscription/updateSubscription/${selectedSubscription._id}`,
          formData
        );
        if (response.data.status === 'success') {
          toast.success('Subscription plan updated successfully');
        }
      } else {
        // Create new subscription
        const response = await apiClient.post(
          "/subscription/createSubcription",
          formData
        );
        if (response.data.status === 'success') {
          toast.success('Subscription plan created successfully');
        }
      }
      setShowCreateModal(false);
      fetchSubscriptions();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Subscription Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage subscription plans and pricing
            </p>
          </div>
          <button
            onClick={handleCreateSubscription}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Plan
          </button>
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <motion.div
                key={subscription._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-2 border-transparent hover:border-primary transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {subscription.name}
                    </h3>
                    <p className="text-3xl font-bold text-primary mt-2">
                      ₦{subscription.price.toLocaleString()}
                      <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSubscription(subscription)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubscription(subscription._id)}
                      className="p-2 text-gray-500 hover:text-error transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Up to {subscription.NoOfDevices} devices
                  </div>
                  {subscription.description && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {subscription.description}
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Created: {format(new Date(subscription.createdAt), 'MMM d, yyyy')}</p>
                  <p>Last updated: {format(new Date(subscription.updatedAt), 'MMM d, yyyy')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedSubscription ? 'Edit Subscription Plan' : 'Create New Plan'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Devices
                </label>
                <input
                  type="number"
                  value={formData.NoOfDevices}
                  onChange={(e) => setFormData({ ...formData, NoOfDevices: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (₦)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    'Save Plan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;