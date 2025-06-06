import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { FormValidation, RegistrationFormData } from "../types/registration";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  value: string;
  validation: FormValidation;
  formData: RegistrationFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  rightElement?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  icon,
  value,
  validation,
  formData,
  onChange,
  className = "",
  disabled = false,
  maxLength,
  rightElement,
}) => {
  const fieldKey = name as keyof FormValidation;
  const fieldValidation = validation[fieldKey];

  const getValidationIcon = () => {
    if (fieldKey === "middleName" && !value) return null;
    if (!value && fieldKey !== "middleName") return null;

    if (fieldValidation?.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (fieldValidation && !fieldValidation.isValid) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  const getInputClasses = () => {
    const baseClasses = `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 ${
      icon ? "pl-10" : ""
    } ${rightElement ? "pr-20" : "pr-10"}`;

    if (!value && fieldKey !== "middleName") {
      return `${baseClasses} border-gray-300 dark:border-gray-600 focus:ring-primary`;
    }
    if (fieldKey === "middleName" && !value) {
      return `${baseClasses} border-gray-300 dark:border-gray-600 focus:ring-primary`;
    }

    if (fieldValidation?.isValid) {
      return `${baseClasses} border-green-300 dark:border-green-600 focus:ring-green-500 bg-green-50 dark:bg-green-900/20`;
    } else if (fieldValidation && !fieldValidation.isValid) {
      return `${baseClasses} border-red-300 dark:border-red-600 focus:ring-red-500 bg-red-50 dark:bg-red-900/20`;
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 focus:ring-primary`;
  };

  const ValidationMessage = () => {
    const message = fieldValidation?.message;
    const isValid = fieldValidation?.isValid;

    if (fieldKey === "middleName" && !value && (!message || message === "")) {
      return null;
    }

    if (!message) return null;

    return (
      <p
        className={`mt-1 text-xs ${
          isValid
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {message}
      </p>
    );
  };

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={getInputClasses()}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={
            type === "email"
              ? "email"
              : type === "password"
              ? "new-password"
              : "off"
          }
        />
        {rightElement && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      <ValidationMessage />
    </div>
  );
};
