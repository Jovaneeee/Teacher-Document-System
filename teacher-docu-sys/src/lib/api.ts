const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      role: string;
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
  };
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface ChangePasswordRequest {
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface CreateSubmissionRequest {
  teacherName: string;
  documentType: string;
  file: File;
}

interface CreateSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    submittedAt: string;
  };
}

export interface SubmissionRecord {
  id: string;
  teacher_name: string;
  document_type: string;
  original_file_name: string;
  file_type: string;
  file_size: number;
  status: 'PENDING' | 'REVIEWED';
  created_at: string;
}

interface ListSubmissionsResponse {
  success: boolean;
  data: SubmissionRecord[];
}

interface SubmissionFileUrlResponse {
  success: boolean;
  data: {
    url: string;
    expiresIn: number;
  };
}

class ApiError extends Error {
  message: string;
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data
    );
  }

  return data as T;
}

function parseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export const api = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return request<ForgotPasswordResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (
    data: ChangePasswordRequest,
    token: string
  ): Promise<ChangePasswordResponse> => {
    return request<ChangePasswordResponse>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  logout: async (token: string): Promise<LogoutResponse> => {
    return request<LogoutResponse>('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  createSubmission: (
    submission: CreateSubmissionRequest,
    onProgress?: (percent: number) => void
  ): Promise<CreateSubmissionResponse> => {
    const formData = new FormData();
    formData.append('teacherName', submission.teacherName);
    formData.append('documentType', submission.documentType);
    formData.append('file', submission.file);

    // XMLHttpRequest is used instead of fetch so upload progress can be reported
    return new Promise<CreateSubmissionResponse>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/api/submissions`);

      xhr.upload.onprogress = (event) => {
        if (onProgress && event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        const data = parseJson<CreateSubmissionResponse>(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300 && data?.success) {
          resolve(data);
          return;
        }

        reject(
          new ApiError(
            data?.message || 'We could not submit your document. Please try again.',
            xhr.status,
            data
          )
        );
      };

      xhr.onerror = () => {
        reject(new ApiError('Network error. Please check your connection and try again.'));
      };

      xhr.send(formData);
    });
  },

  listSubmissions: async (token: string): Promise<ListSubmissionsResponse> => {
    return request<ListSubmissionsResponse>('/api/submissions', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  getSubmissionFileUrl: async (
    id: string,
    token: string,
    download = false
  ): Promise<SubmissionFileUrlResponse> => {
    return request<SubmissionFileUrlResponse>(
      `/api/submissions/${id}/file${download ? '?download=1' : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  },
};

export { ApiError };
