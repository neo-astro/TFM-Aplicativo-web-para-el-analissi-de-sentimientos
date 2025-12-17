// /src/utils/url.ts
export function isValidTikTokUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("tiktok.com") && parsed.pathname.includes("/video/");
  } catch {
    return false;
  }
}
