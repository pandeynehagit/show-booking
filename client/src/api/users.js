import { axiosInstance } from ".";
const BASE_URL = "http://localhost:8082/api/users";

export  const RegisterUser= async(value)=>{
  console.log("axiosInstance",axiosInstance);
  try{
    const response = await axiosInstance.post(`${BASE_URL}/register`,value);// talk to backend server
    return response.data;
  }
  catch(err){
    console.error("error in registration",err.message);
    throw err;
  }
}
export const LoginUser = async (value) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/login`, value); 
    return response.data; // Return response data
  } catch (err) {
    console.error("Login Error:", err); // Log any errors
    throw err; // Throw the error to handle it in the caller
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/get-current-user`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const ForgotPassword = async (values) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL}/forgot-password`,
      values
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const ResetPassword = async (values) => {
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL}/reset-password`,
      values
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
