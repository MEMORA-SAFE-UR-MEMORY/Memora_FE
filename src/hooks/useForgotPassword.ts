import { useState } from "react";
import {
  sendForgotOTP,
  verifyOTP,
  resetPassword,
} from "@src/apis/resetPasswordApi";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSendForgotOTP = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await sendForgotOTP(email);

      if (response === 200) {
        setSuccess(true);
      } else {
        setError("Không thể gửi OTP");
      }

      return response;
    } catch (err: any) {
      console.error("Send OTP error:", err);
      setError(err?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await verifyOTP(otp);

      // tuỳ backend trả về gì, nhưng thường là code 200 hoặc flag success
      if (response === 200) {
        setSuccess(true);
      } else {
        setError("OTP không hợp lệ hoặc đã hết hạn");
      }

      return response;
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      setError(err?.message || "Có lỗi xảy ra khi xác thực OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (otp: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await resetPassword(otp, newPassword);
      if (response === 200) {
        setSuccess(true);
      } else {
        setError("Không thể đặt lại mật khẩu");
      }
      return response;
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err?.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    handleSendForgotOTP,
    handleVerifyOTP,
    handleResetPassword,
  };
};
