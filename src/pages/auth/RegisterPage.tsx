import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Phone,
  MapPin,
  Home,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { authApi } from "../../api/auth";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

interface ValidationResult {
  isValid: boolean;
  message: string;
}

interface FormValidation {
  username: ValidationResult;
  email: ValidationResult;
  password: ValidationResult;
  phoneNumber: ValidationResult;
  keyholderPhone1: ValidationResult;
  keyholderPhone2: ValidationResult;
  firstName: ValidationResult;
  middleName: ValidationResult;
  surName: ValidationResult;
  country: ValidationResult;
  stateOfOrigin: ValidationResult;
  address: ValidationResult;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    keyholderPhone1: "",
    keyholderPhone2: "",
    firstName: "",
    middleName: "",
    surName: "",
    role: "user",
    country: "",
    stateOfOrigin: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [registrationToken, setRegistrationToken] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validation, setValidation] = useState<FormValidation>({
    username: { isValid: false, message: "" },
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    phoneNumber: { isValid: false, message: "" },
    keyholderPhone1: { isValid: false, message: "" },
    keyholderPhone2: { isValid: false, message: "" },
    firstName: { isValid: false, message: "" },
    middleName: { isValid: false, message: "" },
    surName: { isValid: false, message: "" },
    country: { isValid: false, message: "" },
    stateOfOrigin: { isValid: false, message: "" },
    address: { isValid: false, message: "" },
  });

  // Validation patterns
  const patterns = {
    username: /^[a-zA-Z0-9_]{3,20}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phoneNumber: /^(\+234|0)[789][01]\d{8}$/,
    name: /^[a-zA-Z\s]{2,30}$/,
    address: /^[a-zA-Z0-9\s,.-]{5,100}$/,
    country: /^[a-zA-Z\s]{2,50}$/,
    state: /^[a-zA-Z\s]{2,50}$/,
  };

  const validateField = (name: string, value: string): ValidationResult => {
    switch (name) {
      case "username":
        if (!value) return { isValid: false, message: "Username is required" };
        if (!patterns.username.test(value)) {
          return {
            isValid: false,
            message:
              "Username must be 3-20 characters, letters, numbers, and underscores only",
          };
        }
        return { isValid: true, message: "Username looks good!" };

      case "email":
        if (!value) return { isValid: false, message: "Email is required" };
        if (!patterns.email.test(value)) {
          return {
            isValid: false,
            message: "Please enter a valid email address",
          };
        }
        return { isValid: true, message: "Valid email address" };

      case "password":
        if (!value) return { isValid: false, message: "Password is required" };
        if (!patterns.password.test(value)) {
          return {
            isValid: false,
            message:
              "Password must be 8+ characters with uppercase, lowercase, number, and special character",
          };
        }
        return { isValid: true, message: "Strong password!" };

      case "phoneNumber":
      case "keyholderPhone1":
      case "keyholderPhone2":
        if (!value)
          return { isValid: false, message: "Phone number is required" };
        if (!patterns.phoneNumber.test(value)) {
          return {
            isValid: false,
            message:
              "Enter valid Nigerian phone number (e.g., +2348123456789 or 08123456789)",
          };
        }
        return { isValid: true, message: "Valid phone number" };

      case "firstName":
      case "middleName":
      case "surName":
        if (!value)
          return { isValid: false, message: "This field is required" };
        if (!patterns.name.test(value)) {
          return {
            isValid: false,
            message: "Name must be 2-30 characters, letters only",
          };
        }
        return { isValid: true, message: "Valid name" };

      case "country":
        if (!value) return { isValid: false, message: "Country is required" };
        if (!patterns.country.test(value)) {
          return { isValid: false, message: "Enter valid country name" };
        }
        return { isValid: true, message: "Valid country" };

      case "stateOfOrigin":
        if (!value) return { isValid: false, message: "State is required" };
        if (!patterns.state.test(value)) {
          return { isValid: false, message: "Enter valid state name" };
        }
        return { isValid: true, message: "Valid state" };

      case "address":
        if (!value) return { isValid: false, message: "Address is required" };
        if (!patterns.address.test(value)) {
          return {
            isValid: false,
            message: "Address must be 5-100 characters",
          };
        }
        return { isValid: true, message: "Valid address" };

      default:
        return { isValid: true, message: "" };
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change
    const fieldValidation = validateField(name, value);
    setValidation((prev) => ({
      ...prev,
      [name as keyof FormValidation]: fieldValidation,
    }));
  };

  const isFormValid = (): boolean => {
    return Object.values(validation).every((field) => field.isValid);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const newValidation: FormValidation = {} as FormValidation;
    let hasErrors = false;

    Object.keys(formData).forEach((key) => {
      if (key !== "role") {
        const fieldValidation = validateField(
          key,
          formData[key as keyof typeof formData]
        );
        newValidation[key as keyof FormValidation] = fieldValidation;
        if (!fieldValidation.isValid) hasErrors = true;
      }
    });

    setValidation(newValidation);

    if (hasErrors) {
      setError("Please fix the validation errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register(formData);
      if (response.status === "success") {
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

  const handleOtpChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const value = e.target.value.toUpperCase();
    setOtp(value);

    // Automatically verify when 8 characters are entered
    if (value.length === 8) {
      try {
        setIsLoading(true);
        const response = await authApi.verifyOtp({
          otp: value,
          registrationToken,
        });
        if (response.status === "success") {
          toast.success("Registration completed successfully!");
          navigate("/login");
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getValidationIcon = (field: keyof FormValidation) => {
    const fieldValidation = validation[field];
    if (
      !formData[
        field === "keyholderPhone1" || field === "keyholderPhone2"
          ? field
          : (field as keyof typeof formData)
      ]
    )
      return null;

    if (fieldValidation.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getInputClasses = (
    field: keyof FormValidation,
    hasIcon: boolean = false
  ) => {
    const baseClasses = `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 ${
      hasIcon ? "pl-10" : ""
    }`;

    const fieldValidation = validation[field];
    const fieldValue =
      formData[
        field === "keyholderPhone1" || field === "keyholderPhone2"
          ? field
          : (field as keyof typeof formData)
      ];

    if (!fieldValue) {
      return `${baseClasses} border-gray-300 dark:border-gray-600 focus:ring-primary`;
    }

    if (fieldValidation.isValid) {
      return `${baseClasses} border-green-300 dark:border-green-600 focus:ring-green-500 bg-green-50 dark:bg-green-900/20`;
    } else {
      return `${baseClasses} border-red-300 dark:border-red-600 focus:ring-red-500 bg-red-50 dark:bg-red-900/20`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-colors duration-200"
          type="button"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-200">
            {showOtpInput ? "📱 Verify OTP" : "🚀 Create your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-dark transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 transition-colors duration-300 border border-gray-200 dark:border-gray-700">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-r-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {showOtpInput ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Check your phone
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We've sent an 8-character OTP to your phone number
                </p>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="block w-full px-3 py-3 text-center text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white tracking-widest"
                  placeholder="12345678"
                  maxLength={8}
                  pattern="[A-Z0-9]{8}"
                  required
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Enter the 8-character code (letters and numbers)
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
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={getInputClasses("username", true)}
                    placeholder="Enter your username"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getValidationIcon("username")}
                  </div>
                </div>
                {formData.username && (
                  <p
                    className={`mt-1 text-xs ${
                      validation.username.isValid
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {validation.username.message}
                  </p>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {["firstName", "middleName", "surName"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {field === "firstName"
                        ? "First Name"
                        : field === "middleName"
                        ? "Middle Name"
                        : "Surname"}{" "}
                      *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name={field}
                        id={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className={getInputClasses(
                          field as keyof FormValidation
                        )}
                        placeholder={`Enter your ${
                          field === "firstName"
                            ? "first name"
                            : field === "middleName"
                            ? "middle name"
                            : "surname"
                        }`}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {getValidationIcon(field as keyof FormValidation)}
                      </div>
                    </div>
                    {formData[field as keyof typeof formData] && (
                      <p
                        className={`mt-1 text-xs ${
                          validation[field as keyof FormValidation].isValid
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {validation[field as keyof FormValidation].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={getInputClasses("phoneNumber", true)}
                      placeholder="+2348123456789"
                      required
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getValidationIcon("phoneNumber")}
                    </div>
                  </div>
                  {formData.phoneNumber && (
                    <p
                      className={`mt-1 text-xs ${
                        validation.phoneNumber.isValid
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {validation.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={getInputClasses("email", true)}
                      placeholder="you@example.com"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getValidationIcon("email")}
                    </div>
                  </div>
                  {formData.email && (
                    <p
                      className={`mt-1 text-xs ${
                        validation.email.isValid
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {validation.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Keyholder Phones */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {["keyholderPhone1", "keyholderPhone2"].map((field, index) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Emergency Contact {index + 1} *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name={field}
                        id={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        className={getInputClasses(
                          field as keyof FormValidation,
                          true
                        )}
                        placeholder="+2348123456789"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {getValidationIcon(field as keyof FormValidation)}
                      </div>
                    </div>
                    {formData[field as keyof typeof formData] && (
                      <p
                        className={`mt-1 text-xs ${
                          validation[field as keyof FormValidation].isValid
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {validation[field as keyof FormValidation].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Country *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={getInputClasses("country", true)}
                      placeholder="e.g., Nigeria"
                      required
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getValidationIcon("country")}
                    </div>
                  </div>
                  {formData.country && (
                    <p
                      className={`mt-1 text-xs ${
                        validation.country.isValid
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {validation.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="stateOfOrigin"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    State of Origin *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="stateOfOrigin"
                      id="stateOfOrigin"
                      value={formData.stateOfOrigin}
                      onChange={handleChange}
                      className={getInputClasses("stateOfOrigin", true)}
                      placeholder="e.g., Lagos"
                      required
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getValidationIcon("stateOfOrigin")}
                    </div>
                  </div>
                  {formData.stateOfOrigin && (
                    <p
                      className={`mt-1 text-xs ${
                        validation.stateOfOrigin.isValid
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {validation.stateOfOrigin.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Address *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={getInputClasses("address", true)}
                    placeholder="Enter your full address"
                    required
                  />
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getValidationIcon("address")}
                  </div>
                </div>
                {formData.address && (
                  <p
                    className={`mt-1 text-xs ${
                      validation.address.isValid
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {validation.address.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={getInputClasses("password", true)}
                    placeholder="Create a strong password"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getValidationIcon("password")}
                  </div>
                </div>
                {formData.password && (
                  <p
                    className={`mt-1 text-xs ${
                      validation.password.isValid
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {validation.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Create Account
                  </div>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By creating an account, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
