export const ALBUM_BUCKET =
  process.env.EXPO_PUBLIC_ALBUM_BUCKET || "user-albums";

// If your bucket is private, set EXPO_PUBLIC_ALBUM_BUCKET_PUBLIC=false and
// update fetching logic to generate signed URLs at read time.
export const ALBUM_BUCKET_PUBLIC =
  (process.env.EXPO_PUBLIC_ALBUM_BUCKET_PUBLIC ?? "true") === "true";
