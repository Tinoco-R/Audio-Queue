import { generateCodeVerifier, createCodeChallenge, setValueIfNotExists } from "./codeChallenge";
import { readFromFile, writeToFile } from "../youtube/fileHandling";
import { getToken } from "../cookies";

// Soundcloud creating and sending an authorization request
const client_id = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT;
const client_secret = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_SECRET;

const redirectURILocalHost = "http://127.0.0.1:3000/linkPlatforms/soundcloud";
const redirectURI = "https://www.audioqueue.dev/linkPlatforms/soundcloud";
const authURL     = "https://secure.soundcloud.com/authorize";
const tokenURL    = "https://secure.soundcloud.com/oauth/token";
const trackURL    = "https://api.soundcloud.com/tracks";

function isLocalhost() {
    const hostname = window.location.hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

const getRedirectURI = () => {
    if (isLocalhost()) {
        return redirectURILocalHost;
    }
    return redirectURI;
};

function getAuthHeader() {
    return btoa(client_id + ":" + client_secret);
}

export default function userAuthentication() {
    requestSoundcloudAuthorization();
}

function requestSoundcloudAuthorization() {
    localStorage.setItem("last_platform", "SoundCloud");
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);
    
    setValueIfNotExists("code_verifier", codeVerifier);

    let url = authURL;

    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(getRedirectURI());
    url += "&code_challenge=" + codeChallenge;
    url += "&code_challenge_method=S256";
    window.location.href = url;
}

export async function handleRedirectSoundcloud() {
    const code = getAccessCode();
    const accessToken = await fetchAccessToken(code);
}

function getAccessCode() {
    let code = null;
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    code = params.get("code");
    return code;
}

async function fetchAccessToken(code: string | null): Promise<string | null> {
    let accessToken = null;

    const code_verifier = localStorage.getItem("code_verifier");
    localStorage.removeItem("code_verifier");

    let body = "grant_type=authorization_code";
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    body += "&redirect_uri=" + encodeURI(getRedirectURI());
    body += "&code_verifier=" + code_verifier;
    body += "&code=" + code;

    const authHeader = getAuthHeader();
    
    accessToken = await callAuthorizationApi(body, authHeader);

    return accessToken;
}

async function callAuthorizationApi(body: string, header: string): Promise<string | null> {
    let accessToken = null;
    const response = await fetch(tokenURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + header,
        },
        body: body
    });

    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.access_token != undefined) {
        const cookieName = "access_token_soundcloud";
        accessToken = data.access_token;

        document.cookie = `${cookieName}=${accessToken}; Path=/; Secure; SameSite=Strict; Max-Age=3600`;
    }
    if (data.refresh_token != undefined) {
        const cookieName = "refresh_token_soundcloud";
        const refreshToken = data.refresh_token;

        document.cookie = `${cookieName}=${refreshToken}; Path=/; Secure; SameSite=Strict; Max-Age=3600`;
    }

    return accessToken;
}

async function refreshAccessToken() {
    const refreshToken = await getToken("refresh_token_soundcloud");

    let body = "grant_type=refresh_token";
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    body += "&refresh_token=" + refreshToken;

    const header = getAuthHeader();
    await callAuthorizationApi(body, header);    
}

export async function getTracks(query: string, limit: number, developing: boolean = false): Promise<Record<string, string>[]> {
    const accessToken = await getToken("access_token_soundcloud");
    const refreshToken = await getToken("refresh_token_soundcloud");

    if (!accessToken) {
        if (refreshToken) {
            console.log('[getTracks] No access token. Refreshing...');
            await refreshAccessToken();
            return getTracks(query, limit, developing);
        }
        else{
            return [];
        }
    }

    let url = trackURL;

    url += "?q=" + encodeURIComponent(query);
    url += "&access=playable";
    url += "&limit=" + encodeURIComponent(limit);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json; charset=utf-8",
        },
    })

    if (!response.ok) {
        // Need to find method of removing platform from being selectable after using up daily quota
        if (response.status === 429) {
            console.log('Quota exceeded: SoundCloud');
        }
        console.error(`Failed to fetch tracks: ${response.statusText}`);
        return [];
    }

    // If developing, pull data from saved files (DEVELOPMENT ONLY), else make API calls to YT
    // Purpose: saves YouTube API quota from being wasted while developing
    const data = developing ? await readFromFile("dataSC") : await response.json();

    // Store data in a file (DEVELOPMENT ONLY)
    developing ? {} : writeToFile(data, "dataSC");

    const tracksData = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const trackObject: Record<string, string> = {
            artist: item.user.username,
            title: item.title,
            album: "", // TBD for soundcloud (perhaps use other service etc.)
            artwork: item.artwork_url,
            urn: item.urn,
            trackUrl: await getStreamableUrl(item.urn),
            duration: Math.floor(item.duration / 1000).toString(),
        }
        if(trackObject.trackUrl !== "-1") {
            tracksData.push(trackObject);
        }
    }    
    return tracksData;
}

export async function getStreamableUrl(urn: string): Promise<string> {
    const accessToken = await getToken("access_token_soundcloud");
    const refreshToken = await getToken("refresh_token_soundcloud");

    if (!accessToken) {
        if (refreshToken) {
            console.log('[getStreamableUrl] No access token. Refreshing...');
            await refreshAccessToken();
            return getStreamableUrl(urn);
        }
        else{
            return "-1";
        }
    }

    let url = trackURL;

    url += `/${urn}/streams`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json; charset=utf-8",
        },
    })

    if (!response.ok) {
        // Need to find method of removing platform from being selectable after using up daily quota
        if (response.status === 429) {
            console.log('Quota exceeded: SoundCloud');
        }
        console.error(`Failed to fetch streamable URL: ${response.statusText}`);
        return "-1";
    }

    // Returns urls of type: http_mp3_128_url, hls_mp3_128_url, hls_opus_64_url, as well as preview
    const data = await response.json();
    const http_mp3_128_url    = data.http_mp3_128_url;
    
    //const hls_mp3_128_url     = data.hls_mp3_128_url;
    //const hls_opus_64_url     = data.hls_opus_64_url;
    //const preview_mp3_128_url = data.preview_mp3_128_url;
    
    return http_mp3_128_url;
}