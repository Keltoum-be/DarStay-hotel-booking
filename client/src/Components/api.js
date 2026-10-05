// src/Components/api.js

//  
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// د
export const fetchWithNgrok = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    }
  })
}

// إلا بغيتي تستعملو مباشرة فالمستقبل
export const apiFetch = (endpoint, options = {}) => {
  return fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    }
  })
}