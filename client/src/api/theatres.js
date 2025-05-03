import { axiosInstance } from ".";
const BASE_URL = `${process.env.REACT_APP_BASE_URL || "http://localhost:8082"}/api/theatres`;

export const addTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/add-theatre`,
      payload
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};

// Get all theatres for the Admin route
export const getAllTheatresForAdmin = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/get-all-theatres`);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

// Get theatres of a specific owner
export const getAllTheatres = async (ownerId) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/get-all-theatres-by-owner/${ownerId}`
    );
    return response.data;
  } catch (err) {
    console.log("failes to load theatres");
    return err.response;
  }
};

// Update Theatre
export const updateTheatre = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/update-theatre`,
      payload
    );
    return response.data;
  } catch (err) {
    return err.resposne;
  }
};

// Delete Theatre
export const deleteTheatre = async (payload) => {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/delete-theatre/${payload}`
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};