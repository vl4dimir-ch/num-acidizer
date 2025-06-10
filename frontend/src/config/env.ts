const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not defined`);
  }
  return value;
};

export const env = {
  API_URL: getEnvVar('VITE_API_URL'),
} as const; 