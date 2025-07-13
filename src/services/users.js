import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Change if needed

export const getUsers = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getUser = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createUser = async (user, token) => {
  const { data } = await axios.post(API_URL, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user; // Return the user object from the nested response
};

export const updateUser = async (id, user, token) => {
  const { data } = await axios.put(`${API_URL}/${id}`, user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteUser = async (id, token) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getUsersByRole = async (role) => {
  const { data } = await axios.get(`${API_URL}?role=${role}`);
  return data;
};
