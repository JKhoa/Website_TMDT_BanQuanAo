const API_BASE = "http://localhost:3001";

const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmM2Y0ZjYiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iOCI+PHJlY3QgeD0iMTQwIiB5PSIxNDAiIHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiByeD0iMjQiLz48cGF0aCBkPSJtMTQwIDM2MCA5NS05NSAxMjAgMTIwIDcwLTcwIDM1IDM1Ii8+PGNpcmNsZSBjeD0iMzQwIiBjeT0iMjQwIiByPSIzMiIvPjwvZz48L3N2Zz4=";

export function resolveImageUrl(value) {
  if (!value || typeof value !== "string") {
    return FALLBACK_IMAGE;
  }

  const src = value.trim();
  if (!src) {
    return FALLBACK_IMAGE;
  }

  if (/^(https?:|data:|blob:)/i.test(src)) {
    return src;
  }

  if (src.startsWith("//")) {
    return `${window.location.protocol}${src}`;
  }

  if (src.startsWith("/")) {
    return `${API_BASE}${src}`;
  }

  return `${API_BASE}/${src}`;
}

export function resolveImageList(images, fallbackImage) {
  if (Array.isArray(images) && images.length > 0) {
    return images.map((item) => resolveImageUrl(item));
  }
  if (fallbackImage) {
    return [resolveImageUrl(fallbackImage)];
  }
  return [FALLBACK_IMAGE];
}
