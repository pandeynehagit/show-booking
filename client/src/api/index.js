import axios from 'axios';
const token = localStorage.getItem("token");
export const axiosInstance = axios.create({
  
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(function(config){
  const token = localStorage.getItem("token");
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;

},
function(error){
  return Promise.reject(error);
}
);
// check response from backend if token is valid or not. simple way but i have used different method using jw-decode and then verifying the token and using it in protected routes as well.
// axiosInstance.interceptors.response.use(
   
//   (response) => response, // If successful, just return the response
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token expired or invalid
//       console.log('Session expired. Redirecting to login...');
      
//       // Clear the token from localStorage
//       localStorage.removeItem('token');
      
//       // Redirect the user to the login page
//       const navigate = useNavigate();
//       navigate('/login');
//     }
    
//     return Promise.reject(error);
//   }
// );