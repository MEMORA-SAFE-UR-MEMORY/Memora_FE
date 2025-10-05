// src/hooks/useRegister.ts
import { registerUser } from "@src/apis/authApi";
import { useState } from "react";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (userName: string, password: string) => {
    setLoading(true);
    setError(null);
    console.log(userName);
    try {
      const data = await registerUser(userName, password);
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
