const getEnvVar = (name: string): string => {
  const value = import.meta.env[name] ?? 'https://3wy1te7c6a.execute-api.us-east-1.amazonaws.com/prod/';
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not defined`);
  }
  return value;
};

export const env = {
  API_URL: getEnvVar('VITE_API_URL'),
} as const; 