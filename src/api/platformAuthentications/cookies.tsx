'use client';
export default function listSpecificCookies(): boolean[] {
    const keys = ["access_token_spotify", "access_token_youtube", "access_token_apple_music", "access_token_soundcloud"];

    const cookiesExist = [];

    // Get all cookies
    const cookieString = document.cookie;
    const cookieArray = cookieString.split('; ');

    console.log("cookieString", cookieString);
    console.log("cookieArray", cookieArray);

    // Check for each key and add true if the cookie exists, false otherwise
    for (const key of keys) {
        let exists = false;
        for (const cookie of cookieArray) {
            const [name, value] = cookie.split('=');
            if (name.trim() === key) {
                exists = true;
                break;
            }
        }
        cookiesExist.push(exists);
    }

    return cookiesExist;
}

// Retrieves platform's access token / refresh token
export async function getToken(cookieName: string): Promise<string | null> {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${cookieName}`));

  if (cookieValue) {
    const [, value] = cookieValue.split('=');
    return decodeURIComponent(value);
  }

  return null;
}