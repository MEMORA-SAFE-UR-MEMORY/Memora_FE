import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const sendForgotOTP = async (email: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/User/forgot`,
      JSON.stringify(email),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.status;
  } catch (error: any) {
    console.log(error);
    return error;
  }
};

export const verifyOTP = async (otp: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/User/verify-otp?otp=${otp}`
    );

    return response.status; // tuỳ backend trả về gì
  } catch (error: any) {
    console.error("Verify OTP error:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (otp: string, newPassword: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/User/reset?otp=${otp}`,
      JSON.stringify(newPassword), // body chỉ là string
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.status; // backend trả gì thì trả về
  } catch (error: any) {
    console.error(
      "Reset password error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
