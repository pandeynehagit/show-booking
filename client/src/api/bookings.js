import { axiosInstance } from ".";


const BASE_URL = `${process.env.REACT_APP_BASE_URL || "http://localhost:8082"}/api/bookings`;


export const makePayment = async(token,amount)=>{
    try{
        const resp = await axiosInstance.post(`${BASE_URL}/make-payment`,{token,amount});
        return resp.data;
    }catch(err){
        console.log(err);
    }
}

export const bookShow = async(values)=>{
    try{
        const resp = await axiosInstance.post(`${BASE_URL}/book-show`,values);
        return resp.data;
    }catch(err){
        console.log(err);
    }
}

export const getAllBookings = async (payload)=>{
    try{
        const resp = await axiosInstance.get(`${BASE_URL}/all-booking-by-user/${payload.userId}`);
        return resp.data;
    }catch(err){
        console.log(err);
    }
}