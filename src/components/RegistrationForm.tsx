import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Home,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { FormField } from "./ui/FormField";
import { useFormValidation } from "../hooks/useFormValidation";
import { RegistrationFormData } from "../types/registeration";

interface RegistrationFormProps {
  onSubmit: (formData: RegistrationFormData) => void;
  isLoading: boolean;
  error?: string | null;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: "",
    keyholderPhone1: "",
    keyholderPhone2: "",
    firstName: "",
    middleName: "",
    surName: "",
    role: "user",
    country: "",
    stateOfResidence: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { validation, validateAllFields, updateFieldValidation } =
    useFormValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    updateFieldValidation(name, value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!validateAllFields(formData)) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username */}
      <FormField
        label="Username"
        name="username"
        placeholder="Create a unique username"
        required
        icon={<User />}
        value={formData.username}
        validation={validation}
        formData={formData}
        onChange={handleChange}
      />

      {/* Personal Information */}
      <fieldset className="border border-gray-300 dark:border-gray-600 p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
          Personal Information
        </legend>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <FormField
            label="First Name"
            name="firstName"
            placeholder="Enter your first name"
            required
            value={formData.firstName}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
          <FormField
            label="Middle Name"
            name="middleName"
            placeholder="Enter your middle name"
            value={formData.middleName}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
          <FormField
            label="Surname"
            name="surName"
            placeholder="Enter your surname"
            required
            value={formData.surName}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      {/* Contact Information */}
      <fieldset className="border border-gray-300 dark:border-gray-600 p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
          Contact Information
        </legend>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <FormField
            label="Primary Phone"
            name="phoneNumber"
            type="tel"
            placeholder="+2348012345678"
            required
            icon={<Phone />}
            value={formData.phoneNumber}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
          <FormField
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            icon={<Mail />}
            value={formData.email}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      {/* Keyholder Phones */}
      <fieldset className="border border-gray-300 dark:border-gray-600 p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
          Key Holder Phones
        </legend>
        <div className="flex items-start gap-2 p-3 mb-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
          <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Keyholders are trusted partners. OTPs for critical actions may be
            sent to their phone numbers for enhanced security. Both are
            required.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <FormField
            label="Key Holder 1 Phone"
            name="keyholderPhone1"
            type="tel"
            placeholder="+2348012345678"
            required
            icon={<Phone />}
            value={formData.keyholderPhone1}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
          <FormField
            label="Key Holder 2 Phone"
            name="keyholderPhone2"
            type="tel"
            placeholder="+2348012345678"
            required
            icon={<Phone />}
            value={formData.keyholderPhone2}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      {/* Location */}
      <fieldset className="border border-gray-300 dark:border-gray-600 p-4 rounded-md">
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
          Location Details
        </legend>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <FormField
            label="Country"
            name="country"
            placeholder="e.g., Nigeria"
            required
            icon={<MapPin />}
            value={formData.country}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
          <FormField
            label="State of Residence"
            name="stateOfResidence"
            placeholder="e.g., Lagos"
            required
            icon={<MapPin />}
            value={formData.stateOfResidence}
            validation={validation}
            formData={formData}
            onChange={handleChange}
          />
        </div>
        <FormField
          label="Full Residential Address"
          name="address"
          placeholder="Enter your full street address"
          required
          icon={<Home />}
          value={formData.address}
          validation={validation}
          formData={formData}
          onChange={handleChange}
          className="mt-6"
        />
      </fieldset>

      {/* Password */}
      <FormField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Create a strong password"
        required
        icon={<Lock />}
        value={formData.password}
        validation={validation}
        formData={formData}
        onChange={handleChange}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span>Creating Account...</span>
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
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
};
