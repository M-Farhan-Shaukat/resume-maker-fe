export const getErrorMessage = (error) => {
  if (!error) return "Something went wrong.";

  // Extract main error message (if present as a string)
  const mainMessage = typeof error.message === "string" ? error.message : "";

  // Extract validation messages (e.g., { email: ["The email has already been taken."] })
  const validationMessages = error?.message;

  let formattedValidationErrors = "";

  if (validationMessages && typeof validationMessages === "object") {
    formattedValidationErrors = Object.entries(validationMessages)
      .map(([field, messages]) => `${messages.join(", ")}`) // Join multiple messages for a field
      .join("; "); // Separate different field errors
  }

  // Ensure the returned value is always a string
  return mainMessage || formattedValidationErrors || "Something went wrong.";
};

export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};
