// src/apis/authApi.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

console.log(BASE_URL);

export const registerUser = async (userName: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/User/register`, {
      userName,
      password,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Đăng ký thất bại");
  }
};

export const loginUser = async (userName: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/User/login`, {
      userName,
      password,
    });
    console.log(response.data);
    return response.data; // thường sẽ trả về token hoặc thông tin user
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Đăng nhập thất bại");
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/User/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

interface TokenPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    // Check if token will expire in next 5 minutes
    return decoded.exp * 1000 < Date.now() + 5 * 60 * 1000;
  } catch {
    return true;
  }
};
