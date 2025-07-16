import axios from "axios";

const API_URL = "https://ai-kid-tutor-api.onrender.com";

export const getUsers = async (token) => {
  const { data } = await axios.get(`${API_URL}/admin/users/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export const getUser = async (id, token) => {
  const { data } = await axios.get(`${API_URL}/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createUser = async (user, token) => {
  const { data } = await axios.post(`${API_URL}/users`, user, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const updateUser = async (id, user, token) => {
  const { data } = await axios.put(`${API_URL}/admin/users/${id}`, user, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const deleteUser = async (id, token) => {
  const { data } = await axios.delete(`${API_URL}/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getUsersByRole = async (role) => {
  const { data } = await axios.get(`${API_URL}?role=${role}`);
  return data;
};
