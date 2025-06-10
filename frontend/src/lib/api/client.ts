import { env } from '../../config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

const baseUrl = env.API_URL.replace(/\/$/, '');

async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    let data: T;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text() as T;
    }

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data && 'message' in data 
        ? (data as { message: string }).message
        : `HTTP ${response.status}: ${response.statusText}`;
      
      throw new ApiError(errorMessage, response.status, response.statusText);
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to server', 0, 'Network Error');
    }
    
    throw new ApiError('An unexpected error occurred', 500, 'Internal Error');
  }
}

export const apiClient = {
  get: async <T = unknown>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { ...options, method: 'GET' });
  },

  post: async <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put: async <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete: async <T = unknown>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
  },
}; 