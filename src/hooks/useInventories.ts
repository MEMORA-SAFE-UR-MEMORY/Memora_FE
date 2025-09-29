// src/hooks/useInventory.ts
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@src/lib/supabase";

export const useInventory = () => {
  const [inventoryId, setInventoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy user từ AsyncStorage
        const userData = await AsyncStorage.getItem("user");
        if (!userData) {
          setError("User not found in storage");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        const userId = user?.id;
        if (!userId) {
          setError("Invalid user id");
          setLoading(false);
          return;
        }

        // Query inventory theo user_id
        const { data, error } = await supabase
          .from("inventories")
          .select("id")
          .eq("user_id", userId);

        console.log("data inven:", data);
        if (error) {
          setError(error.message);
        } else {
          setInventoryId(data[0]?.id || null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return { inventoryId, loading, error };
};
