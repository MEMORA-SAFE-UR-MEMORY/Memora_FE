import { useState, useCallback } from "react";
import { supabase } from "@src/lib/supabase";

interface User {
  id: string;
  username: string;
  email: string;
}

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, email")
        .order("username");

      if (error) throw error;
      setUsers(data as User[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, email")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as User;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
  };
}
