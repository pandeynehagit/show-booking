import{axiosInstance} from ".";
const BASE_URL = `${process.env.REACT_APP_BASE_URL || "http://localhost:8082"}/api/movies`;

export const getAllMovies = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/get-all-movies`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addMovie = async (values) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/add-movie`, values);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateMovie = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/update-movie`,
      payload
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteMovie = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/delete-movie`,
      payload
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getMovieById = async (id) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/movie/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};