export function toCdnImageUrl(
  publicUrl: string,
  opts: {
    w?: number;
    h?: number;
    q?: number;
    format?: "webp" | "jpg" | "png";
  } = {}
) {
  if (!publicUrl) return publicUrl;
  const base = publicUrl.replace(
    "/storage/v1/object/",
    "/storage/v1/render/image/"
  );
  const qs = new URLSearchParams();
  qs.set("resize", "contain");
  if (opts.w) qs.set("width", `${opts.w}`);
  if (opts.h) qs.set("height", `${opts.h}`);
  qs.set("quality", `${opts.q ?? 80}`);
  qs.set("format", opts.format ?? "webp");
  return `${base}?${qs.toString()}`;
}
