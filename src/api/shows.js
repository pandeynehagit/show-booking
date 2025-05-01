import { axiosInstance } from ".";
const BASE_URL = "http://localhost:8082/api/shows";
export const addShow = async (payload) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/add-show`, payload);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const updateShow = async (payload) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/update-show`, payload);
    console.log(payload, response);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getShowsByTheatre = async (payload) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/get-all-shows-by-theatre/${payload.theatreId}`
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const deleteShow = async (payload) => {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/delete-show/${payload.showId}`
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getAllTheatresByMovie = async ({ movie, date }) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/get-all-theatres-by-movie/${movie}/${date}`
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getShowById = async (payload) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/get-show-by-id/${payload.showId}`
    );
    return response.data;
  } catch (err) {
    return err.message;
  }
};