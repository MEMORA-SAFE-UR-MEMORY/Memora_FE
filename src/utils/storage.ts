import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALBUM_BUCKET_PUBLIC } from "@src/config/storage";
import { supabase } from "@src/utils/supabase";

export async function getDisplayUrl(
  bucket: string,
  path: string,
  cacheBust?: boolean
): Promise<string> {
  if (ALBUM_BUCKET_PUBLIC) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const url = data.publicUrl;
    return cacheBust ? `${url}?t=${Date.now()}` : url;
  } else {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60); // 1h
    if (error || !data?.signedUrl)
      throw error ?? new Error("Signed URL failed");
    return cacheBust ? `${data.signedUrl}&t=${Date.now()}` : data.signedUrl;
  }
}

// ONBOARDING
const ONBOARDING_KEY = "hasSeenOnboarding_v1";

export const setHasSeenOnboarding = async () => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch (e) {
    console.warn("Error saving onboarding flag", e);
  }
};

export const getHasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const v = await AsyncStorage.getItem(ONBOARDING_KEY);
    return v === "true";
  } catch (e) {
    console.warn("Error reading onboarding flag", e);
    return false;
  }
};

export const resetOnboardingFlag = async () => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (e) {
    console.warn("Error resetting onboarding flag", e);
  }
};
