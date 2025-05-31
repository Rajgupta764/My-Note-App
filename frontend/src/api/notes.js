import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getNotes = async () => {
  try {
    const res = await axios.get(API_URL, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("Error fetching notes:", err.response?.data || err.message);
    return [];
  }
};

export const createNote = async (noteData) => {
  try {
    const res = await axios.post(API_URL, noteData, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("Error creating note:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteNote = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("Error deleting note:", err.response?.data || err.message);
    throw err;
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, noteData, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("Error updating note:", err.response?.data || err.message);
    throw err;
  }
};
