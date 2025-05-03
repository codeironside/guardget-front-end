import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Phone, MapPin, Home } from 'lucide-react';
import { authApi } from '../../api/auth';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    keyholderPhone1: '',
    keyholderPhone2: '',
    firstName: '',
    middleName: '',
    surName: '',
    role: 'user',
    country: '',
    stateOfOrigin: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.register(formData);
      if (response.status === 'success') {
        setRegistrationToken(response.registrationToken);
        setShowOtpInput(true);
        toast.success(response.message);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setOtp(value);

    // Automatically verify when 8 characters are entered
    if (value.length === 8) {
      try {
        setIsLoading(true);
        const response = await authApi.verifyOtp({ otp: value, registrationToken });
        if (response.status === 'success') {
          toast.success('Registration completed successfully!');
          navigate('/login');
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {showOtpInput ? 'Verify OTP' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {showOtpInput ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    className="input-field"
                    placeholder="Enter 8-character OTP"
                    maxLength={8}
                    pattern="[A-Z0-9]{8}"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Please enter the 8-character OTP sent to your phone. Use only uppercase letters and numbers.
                </p>
              </div>

              {isLoading && (
                <div className="flex justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="keyholderPhone1" className="block text-sm font-medium text-gray-700">
                  Keyholder Phone 1
                </label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    name="keyholderPhone1"
                    id="keyholderPhone1"
                    value={formData.keyholderPhone1}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="keyholderPhone2" className="block text-sm font-medium text-gray-700">
                  Keyholder Phone 2
                </label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    name="keyholderPhone2"
                    id="keyholderPhone2"
                    value={formData.keyholderPhone2}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="surName" className="block text-sm font-medium text-gray-700">
                    Surname
                  </label>
                  <input
                    type="text"
                    name="surName"
                    id="surName"
                    value={formData.surName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="stateOfOrigin" className="block text-sm font-medium text-gray-700">
                  State of Origin
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="stateOfOrigin"
                    id="stateOfOrigin"
                    value={formData.stateOfOrigin}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;