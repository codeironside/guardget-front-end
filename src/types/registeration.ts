// types/registration.ts
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface FormValidation {
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
  stateOfResidence: ValidationResult;
  address: ValidationResult;
}

export interface RegistrationFormData {
  username: string;
  keyholderPhone1: string;
  keyholderPhone2: string;
  firstName: string;
  middleName: string;
  surName: string;
  role: string;
  country: string;
  stateOfResidence: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
}

