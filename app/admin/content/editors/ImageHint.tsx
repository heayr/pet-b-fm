export function ImageHint({ url }: { url: string }) {
  if (!url) return null;
  const isLikelyImage =
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)($|\?)/i.test(url) ||
    url.startsWith("/images/") ||
    url.includes("avatars.mds.yandex") ||
    url.includes("imgur.com") ||
    url.includes("images.unsplash");
  if (isLikelyImage) return null;
  return (
    <p className="text-xs text-amber-600 mt-1">
      ⚠ URL не похож на изображение. Убедитесь, что ссылка ведёт на картинку.
    </p>
  );
}
