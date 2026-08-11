/**
 * SCIC/EJP-13 Standardized API Client for Next.js Frontend -> Express Backend
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = (customHeaders = {}, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP ${response.status} error`;
    return {
      success: false,
      status: response.status,
      message: errorMsg,
      data: data?.data || null,
    };
  }

  return {
    success: data?.success ?? true,
    status: response.status,
    message: data?.message || "Success",
    data: data?.data ?? data,
  };
};

export const apiClient = {
  get: async (endpoint, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(options.headers, options.token),
      ...options,
    });
    return handleResponse(response);
  },

  post: async (endpoint, body = {}, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(options.headers, options.token),
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },

  put: async (endpoint, body = {}, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(options.headers, options.token),
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },

  patch: async (endpoint, body = {}, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: getHeaders(options.headers, options.token),
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },

  delete: async (endpoint, body = null, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(options.headers, options.token),
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...options,
    });
    return handleResponse(response);
  },
};

export default apiClient;
