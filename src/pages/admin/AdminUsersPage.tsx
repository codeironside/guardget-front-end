import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Search,
  Filter,
  Edit,
  UserPlus,
  AlertCircle,
  X,
  Loader,
} from "lucide-react";
import { adminApi } from "../../api/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface AdminUser {
  _id: string;
  username: string;
  firstName: string;
  middleName: string | null;
  surName: string;
  role: string;
  country: string;
  stateOfOrigin: string;
  phoneNumber: string;
  email: string;
  emailVerified: boolean;
  subActive: boolean;
  createdAt: string;
  updatedAt: string;
  devicesCount: number;
  subActiveTill: string | null;
  subscriptionStatus: string;
}

interface CreateAdminFormData {
  username: string;
  firstName: string;
  middleName: string;
  surName: string;
  email: string;
  phoneNumber: string;
  country: string;
  stateOfOrigin: string;
  address: string;
  password: string;
  confirmPassword: string;
  keyholder: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    subscriptionStatus: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [formData, setFormData] = useState<CreateAdminFormData>({
    username: "",
    firstName: "",
    middleName: "",
    surName: "",
    email: "",
    phoneNumber: "",
    country: "Nigeria", // Default value
    stateOfOrigin: "",
    address: "",
    password: "",
    confirmPassword: "",
    keyholder: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CreateAdminFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        role: filters.role || undefined,
        subscriptionStatus: filters.subscriptionStatus || undefined,
      });

      if (response.status === "success") {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = () => {
    setShowCreateModal(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name as keyof CreateAdminFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateAdminFormData, string>> = {};

    if (!formData.username) errors.username = "Username is required";
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.surName) errors.surName = "Surname is required";

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!formData.country) errors.country = "Country is required";
    if (!formData.stateOfOrigin) errors.stateOfOrigin = "State is required";
    if (!formData.address) errors.address = "Address is required";

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (formData.keyholder && !/^\d+$/.test(formData.keyholder)) {
      errors.keyholder = "Keyholder must be a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        username: formData.username,
        firstName: formData.firstName,
        middleName: formData.middleName,
        surName: formData.surName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        stateOfOrigin: formData.stateOfOrigin,
        address: formData.address,
        password: formData.password,
        role: "admin",
        keyholder: formData.keyholder,
      };

      const response = await adminApi.createAdmin(dataToSubmit);

      if (response.status === "success") {
        toast.success("Admin created successfully");
        setShowCreateModal(false);

        // Reset form data
        setFormData({
          username: "",
          firstName: "",
          middleName: "",
          surName: "",
          email: "",
          phoneNumber: "",
          country: "Nigeria",
          stateOfOrigin: "",
          address: "",
          password: "",
          confirmPassword: "",
          keyholder: "",
        });

        // Refresh users list
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to create admin");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating admin");
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.surName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all users in the system
            </p>
          </div>
          <button
            onClick={handleCreateAdmin}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Create Admin
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={filters.role}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, role: e.target.value }))
              }
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={filters.subscriptionStatus}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  subscriptionStatus: e.target.value,
                }))
              }
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Subscriptions</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-error bg-opacity-10 text-error p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Devices
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {user.firstName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.surName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-primary bg-opacity-10 text-primary"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.devicesCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.subscriptionStatus === "Active"
                            ? "bg-success bg-opacity-10 text-success"
                            : "bg-warning bg-opacity-10 text-warning"
                        }`}
                      >
                        {user.subscriptionStatus}
                      </span>
                      {user.subActiveTill && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Until{" "}
                          {format(new Date(user.subActiveTill), "MMM d, yyyy")}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {/* Add page numbers here if needed */}
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-auto"
            style={{ maxHeight: "calc(100vh - 40px)" }}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Create Admin Account
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Role is automatically set to admin
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="overflow-y-auto p-4 sm:p-6"
              style={{ maxHeight: "calc(100vh - 140px)" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {/* Left Column */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Basic Information
                    </h4>

                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Username <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.username
                            ? "border-error"
                            : "border-gray-300 dark:border-gray-600"
                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {formErrors.username && (
                        <p className="mt-1 text-sm text-error">
                          {formErrors.username}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          First Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            formErrors.firstName
                              ? "border-error"
                              : "border-gray-300 dark:border-gray-600"
                          } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-sm text-error">
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="middleName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Middle Name
                        </label>
                        <input
                          type="text"
                          id="middleName"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="surName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Surname <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="surName"
                          name="surName"
                          value={formData.surName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            formErrors.surName
                              ? "border-error"
                              : "border-gray-300 dark:border-gray-600"
                          } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {formErrors.surName && (
                          <p className="mt-1 text-sm text-error">
                            {formErrors.surName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.email
                            ? "border-error"
                            : "border-gray-300 dark:border-gray-600"
                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-error">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone Number <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.phoneNumber
                            ? "border-error"
                            : "border-gray-300 dark:border-gray-600"
                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {formErrors.phoneNumber && (
                        <p className="mt-1 text-sm text-error">
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Location & Access Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Country <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            formErrors.country
                              ? "border-error"
                              : "border-gray-300 dark:border-gray-600"
                          } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {formErrors.country && (
                          <p className="mt-1 text-sm text-error">
                            {formErrors.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="stateOfOrigin"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          State <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="stateOfOrigin"
                          name="stateOfOrigin"
                          value={formData.stateOfOrigin}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            formErrors.stateOfOrigin
                              ? "border-error"
                              : "border-gray-300 dark:border-gray-600"
                          } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {formErrors.stateOfOrigin && (
                          <p className="mt-1 text-sm text-error">
                            {formErrors.stateOfOrigin}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Address <span className="text-error">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className={`w-full px-3 py-2 border ${
                          formErrors.address
                            ? "border-error"
                            : "border-gray-300 dark:border-gray-600"
                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-error">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Password <span className="text-error">*</span>
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            formErrors.password
                              ? "border-error"
                              : "border-gray-300 dark:border-gray-600"
                          } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {formErrors.password && (
                          <p className="mt-1 text-sm text-error">
                            {formErrors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Confirm Password <span className="text-error">*</span>
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${
                            formErrors.confirmPassword
                              ? "border-error"
                              : "border-gray-300 dark:border-gray-600"
                          } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {formErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-error">
                            {formErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="keyholder"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Keyholder Phone Number
                      </label>
                      <input
                        type="text"
                        id="keyholder"
                        name="keyholder"
                        value={formData.keyholder}
                        onChange={handleInputChange}
                        placeholder="Enter phone number for keyholder (optional)"
                        className={`w-full px-3 py-2 border ${
                          formErrors.keyholder
                            ? "border-error"
                            : "border-gray-300 dark:border-gray-600"
                        } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {formErrors.keyholder && (
                        <p className="mt-1 text-sm text-error">
                          {formErrors.keyholder}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Enter a phone number if this admin will be a keyholder
                      </p>
                    </div>

                    {/* Hidden role field - automatically set to admin */}
                    <input type="hidden" name="role" value="admin" />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center text-sm font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Admin"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
