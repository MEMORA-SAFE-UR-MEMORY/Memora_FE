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
