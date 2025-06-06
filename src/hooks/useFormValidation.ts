import { useState, useCallback } from "react";
import {
  FormValidation,
  ValidationResult,
  RegistrationFormData,
} from "../types/registeration";

const validationPatterns = {
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

export const useFormValidation = () => {
  const [validation, setValidation] = useState<FormValidation>({
    username: { isValid: false, message: "" },
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    phoneNumber: { isValid: false, message: "" },
    keyholderPhone1: { isValid: false, message: "" },
    keyholderPhone2: { isValid: false, message: "" },
    firstName: { isValid: false, message: "" },
    middleName: { isValid: true, message: "" },
    surName: { isValid: false, message: "" },
    country: { isValid: false, message: "" },
    stateOfResidence: { isValid: false, message: "" },
    address: { isValid: false, message: "" },
  });

  const validateField = useCallback(
    (name: string, value: string): ValidationResult => {
      switch (name) {
        case "username":
          if (!value)
            return { isValid: false, message: "Username is required." };
          if (!validationPatterns.username.test(value)) {
            return {
              isValid: false,
              message: "Username: 3-20 chars (letters, numbers, underscores).",
            };
          }
          return { isValid: true, message: "Username looks good!" };

        case "email":
          if (!value) return { isValid: false, message: "Email is required." };
          if (!validationPatterns.email.test(value)) {
            return {
              isValid: false,
              message: "Please enter a valid email address.",
            };
          }
          return { isValid: true, message: "Valid email address." };

        case "password":
          if (!value)
            return { isValid: false, message: "Password is required." };
          if (!validationPatterns.password.test(value)) {
            return {
              isValid: false,
              message:
                "Password: 8+ chars, with uppercase, lowercase, number, and special character.",
            };
          }
          return { isValid: true, message: "Strong password!" };

        case "phoneNumber":
        case "keyholderPhone1":
        case "keyholderPhone2":
          if (!value)
            return { isValid: false, message: "Phone number is required." };
          if (!validationPatterns.phoneNumber.test(value)) {
            return {
              isValid: false,
              message:
                "Enter valid Nigerian phone (e.g., +23480... or 080...).",
            };
          }
          return { isValid: true, message: "Valid phone number." };

        case "firstName":
        case "surName":
          if (!value)
            return {
              isValid: false,
              message: `${
                name === "firstName" ? "First name" : "Surname"
              } is required.`,
            };
          if (!validationPatterns.name.test(value)) {
            return { isValid: false, message: "Name must be 2-30 letters." };
          }
          return { isValid: true, message: "Valid name." };

        case "middleName":
          if (!value) return { isValid: true, message: "" };
          if (!validationPatterns.name.test(value)) {
            return {
              isValid: false,
              message: "Middle name: 2-30 letters if provided.",
            };
          }
          return { isValid: true, message: "Valid middle name." };

        case "country":
          if (!value)
            return { isValid: false, message: "Country is required." };
          if (!validationPatterns.country.test(value)) {
            return { isValid: false, message: "Enter a valid country name." };
          }
          return { isValid: true, message: "Valid country." };

        case "stateOfResidence":
          if (!value)
            return {
              isValid: false,
              message: "State of residence is required.",
            };
          if (!validationPatterns.state.test(value)) {
            return { isValid: false, message: "Enter a valid state name." };
          }
          return { isValid: true, message: "Valid state." };

        case "address":
          if (!value)
            return { isValid: false, message: "Address is required." };
          if (!validationPatterns.address.test(value)) {
            return {
              isValid: false,
              message: "Address must be 5-100 characters.",
            };
          }
          return { isValid: true, message: "Valid address." };

        default:
          return { isValid: true, message: "" };
      }
    },
    []
  );

  const validateAllFields = useCallback(
    (formData: RegistrationFormData): boolean => {
      const allFieldsValidated: Partial<FormValidation> = {};
      let allValid = true;

      (Object.keys(formData) as Array<keyof RegistrationFormData>).forEach(
        (key) => {
          if (key === "role") return;
          const currentValidation = validateField(key, formData[key]);
          allFieldsValidated[key as keyof FormValidation] = currentValidation;
          if (!currentValidation.isValid) {
            allValid = false;
          }
        }
      );

      setValidation((prev) => ({
        ...prev,
        ...(allFieldsValidated as FormValidation),
      }));

      return allValid;
    },
    [validateField]
  );

  const updateFieldValidation = useCallback(
    (fieldName: string, value: string) => {
      const fieldValidation = validateField(fieldName, value);
      setValidation((prev) => ({
        ...prev,
        [fieldName as keyof FormValidation]: fieldValidation,
      }));
    },
    [validateField]
  );

  return {
    validation,
    validateField,
    validateAllFields,
    updateFieldValidation,
  };
};

// components/ui/FormField.tsx

// components/OTPInput.tsx


// components/RegistrationForm.tsx
