import axios from "axios";

const API_URL = "https://ai-kid-tutor-api.onrender.com/api/achievements"; // Change if needed

export const getAchievements = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getAchievement = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createAchievement = async (achievement, token) => {
  const { data } = await axios.post(API_URL, achievement, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateAchievement = async (id, achievement, token) => {
  const { data } = await axios.put(`${API_URL}/${id}`, achievement, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteAchievement = async (id, token) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getAchievementsByUser = async (userId) => {
  const { data } = await axios.get(`${API_URL}?userId=${userId}`);
  return data;
};
