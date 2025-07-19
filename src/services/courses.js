import axios from "axios";

const API_URL = "https://ai-kid-tutor-api.onrender.com/courses";

/**
 * Fetch all courses.
 * @returns {Promise<Object[]>}
 */
export const getCourses = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

/**
 * Fetch a single course by ID.
 * @param {string} id - Course ID.
 * @param {string} token - Bearer token for authorization.
 * @returns {Promise<Object>}
 */
export const getCourse = async (id, token) => {
  const { data } = await axios.get(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

/**
 * Create a new course.
 * @param {Object} course - Course data (see API docs for required fields).
 * @param {string} token - Bearer token for authorization.
 * @returns {Promise<Object>}
 */
export const createCourse = async (course, token) => {
  const { data } = await axios.post(`${API_URL}/create`, course, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

/**
 * Update the duration of a course by ID.
 * @param {string} id - Course ID.
 * @param {string} duration - New duration string (e.g., "6 weeks").
 * @param {string} token - Bearer token for authorization.
 * @returns {Promise<Object>}
 */
export const updateCourseDuration = async (id, duration, token) => {
  const { data } = await axios.put(
    `${API_URL}/${id}`,
    { duration },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

/**
 * Update a course by ID with full course data.
 * @param {string} id - Course ID.
 * @param {Object} courseData - Full course data to update.
 * @param {string} token - Bearer token for authorization.
 * @returns {Promise<Object>}
 */
export const updateCourse = async (id, courseData, token) => {
  const { data } = await axios.put(`${API_URL}/${id}`, courseData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

/**
 * Delete a course by ID.
 * @param {string} id - Course ID.
 * @param {string} token - Bearer token for authorization.
 * @returns {Promise<Object>} - Should be an empty object on success.
 */
export const deleteCourse = async (id, token) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
