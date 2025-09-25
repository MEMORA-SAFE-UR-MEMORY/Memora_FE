// src/hooks/useRegister.ts
import { useState } from "react";
import { registerUser } from "@src/apis/authApi";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (userName: string, password: string) => {
    console.log("username, password", userName, password);
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(userName, password);
      console.log(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};
