import axios from "axios";

const API_URL = "http://localhost:5000/api/courses"; // Change if needed

export const getCourses = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getCourse = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createCourse = async (course, token) => {
  const { data } = await axios.post(API_URL, course, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateCourse = async (id, course, token) => {
  const { data } = await axios.put(`${API_URL}/${id}`, course, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteCourse = async (id, token) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
