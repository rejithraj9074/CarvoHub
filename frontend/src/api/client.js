const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export async function postMultipart(path, formData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(data?.errors)
      ? data.errors.map((e) => `${e.path || e.param || 'field'}: ${e.msg || e.message}`).join('; ')
      : (typeof data?.error === 'string' ? data.error : undefined);
    const message = details
      ? `${data?.message || 'Request failed'} - ${details}`
      : (data?.message || `Request failed with ${response.status}`);
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function putMultipart(path, formData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(data?.errors)
      ? data.errors.map((e) => `${e.path || e.param || 'field'}: ${e.msg || e.message}`).join('; ')
      : (typeof data?.error === 'string' ? data.error : undefined);
    const message = details
      ? `${data?.message || 'Request failed'} - ${details}`
      : (data?.message || `Request failed with ${response.status}`);
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function getJson(path) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || `Request failed with ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function deleteJson(path) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || `Request failed with ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function postJson(path, body) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || `Request failed with ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function putJson(path, body) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || `Request failed with ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export default { postJson, putJson, getJson, deleteJson, postMultipart, putMultipart };


