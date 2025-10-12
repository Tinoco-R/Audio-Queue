'use client'
import LinkablePlatforms, { LinkablePlatformsNoSSR } from "@/components/linkedAccounts";

export default function LinkPlatforms() {
    const keys = ["access_token_spotify", "access_token_youtube", "access_token_apple_music", "access_token_soundcloud"];
    const cookiesExist = [];

    // Get all cookies
    if (typeof window !== "undefined") {
        const cookieString = document.cookie;
        const cookieArray = cookieString.split('; ');

        // Check for each key and add true if the cookie exists, false otherwise
        for (const key of keys) {
            let exists = false;
            for (const cookie of cookieArray) {
                const [name, value] = cookie.split('=');
                if (name.trim() === key) {
                    exists = true;
                    value;
                    break;
                }
            }
            cookiesExist.push(exists);
        }
    }

    return(
        <div>            
            <LinkablePlatformsNoSSR linked={cookiesExist}></LinkablePlatformsNoSSR>
        </div>
    )
}