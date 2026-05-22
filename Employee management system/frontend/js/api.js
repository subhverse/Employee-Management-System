// API helper - handles all requests to the backend
const API_BASE = window.location.origin + '/api';

// Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Check if user is logged in
function isLoggedIn() {
  return !!getToken();
}

// Save token after login
function saveAuth(token, adminEmail) {
  localStorage.setItem('token', token);
  localStorage.setItem('adminEmail', adminEmail || '');
}

// Clear token on logout
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('adminEmail');
}

// Generic fetch with auth header
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  const response = await fetch(API_BASE + endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearAuth();
    window.location.href = 'index.html';
    throw new Error(data.message || 'Unauthorized');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth APIs
async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Employee APIs
async function getEmployees(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.department) query.append('department', params.department);
  if (params.employeeId) query.append('employeeId', params.employeeId);
  const qs = query.toString();
  return apiRequest('/employees' + (qs ? '?' + qs : ''));
}

async function getEmployee(id) {
  return apiRequest('/employees/' + id);
}

async function addEmployee(employee) {
  return apiRequest('/employees', {
    method: 'POST',
    body: JSON.stringify(employee),
  });
}

async function updateEmployee(id, employee) {
  return apiRequest('/employees/' + id, {
    method: 'PUT',
    body: JSON.stringify(employee),
  });
}

async function deleteEmployee(id) {
  return apiRequest('/employees/' + id, {
    method: 'DELETE',
  });
}
