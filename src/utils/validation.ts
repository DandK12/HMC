export const required = (value: any) => 
  !value ? 'This field is required' : undefined;

export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `Must be at least ${min} characters` : undefined;

export const maxLength = (max: number) => (value: string) =>
  value && value.length > max ? `Must be at most ${max} characters` : undefined;

export const isValidDate = (value: string) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? 'Invalid date format' : undefined;
};

export const isValidTime = (value: string) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return !timeRegex.test(value) ? 'Invalid time format (HH:mm)' : undefined;
};

export const isValidEmail = (value: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return !emailRegex.test(value) ? 'Invalid email address' : undefined;
};

export const isValidPassword = (value: string) => {
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*]/.test(value)) return 'Password must contain at least one special character';
  return undefined;
};

export const isValidPhoneNumber = (value: string) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return !phoneRegex.test(value) ? 'Invalid phone number' : undefined;
};

export const isValidPassport = (value: string) => {
  // Basic passport format validation
  const passportRegex = /^[A-Z0-9]{6,9}$/i;
  return !passportRegex.test(value) ? 'Invalid passport number' : undefined;
};

export const isValidWorkingHours = (checkIn: string, checkOut?: string) => {
  const checkInDate = new Date(checkIn);
  if (isNaN(checkInDate.getTime())) {
    return 'Invalid check-in time';
  }

  if (checkOut) {
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkOutDate.getTime())) {
      return 'Invalid check-out time';
    }
    if (checkOutDate <= checkInDate) {
      return 'Check-out time must be after check-in time';
    }
  }

  return undefined;
};

export const validateLeaveRequest = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date format';
  }

  if (end < start) {
    return 'End date must be after start date';
  }

  if (start < new Date()) {
    return 'Start date cannot be in the past';
  }

  return undefined;
};