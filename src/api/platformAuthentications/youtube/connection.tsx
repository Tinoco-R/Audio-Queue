import { Duration } from 'luxon';
import { writeToFile, readFromFile } from "./fileHandling";
import { getToken } from "../cookies";

// Soundcloud creating and sending an authorization request
const public_key = process.env.NEXT_PUBLIC_KEY_YT;
const client_id = process.env.NEXT_PUBLIC_AUTH_YOUTUBE_CLIENT;
const client_secret = process.env.NEXT_PUBLIC_AUTH_YOUTUBE_CLIENT_SECRET;

const redirectURI = "https://www.audioqueue.dev/linkPlatforms/youtube";
const redirectURILocalHost = "http://127.0.0.1:3000/linkPlatforms/youtube";

const scope = "https://www.googleapis.com/auth/youtube.readonly";
const authURL   = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenURL = "https://oauth2.googleapis.com/token";

const dataApiURL = "https://www.googleapis.com/youtube/v3";
const searchURL = dataApiURL + "/search";
const videosURL =  dataApiURL + "/videos";

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
    requestYoutubeAuthorization();
}

function requestYoutubeAuthorization() {
    localStorage.setItem("last_platform", "YouTube");

    let url = authURL;

    url += "?client_id=" + client_id;
    url += "&redirect_uri=" + encodeURI(getRedirectURI());
    url += "&response_type=code";
    url += "&scope=" + scope;
    window.location.href = url;
}

export async function handleRedirectYoutube() {
    const [code, scope] = getAccessCodeAndScope();
    const accessToken = await fetchAccessToken(code);
}

function getAccessCodeAndScope() {
    let code = null;
    let scope = null;
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    code = params.get("code");
    scope = params.get("scope");
    return [code, scope];
}

async function fetchAccessToken(code: string | null): Promise<string | null> {
    let accessToken = null;

    let body = "grant_type=authorization_code";
    body += "&redirect_uri=" + encodeURI(getRedirectURI());
    body += "&code=" + code;
    body += "&client_id=" + client_id
    body += "&client_secret=" + client_secret

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
        const cookieName = "access_token_youtube";
        accessToken = data.access_token;

        document.cookie = `${cookieName}=${accessToken}; Path=/; Secure; SameSite=Lax; Max-Age=3600`;
    }
    if (data.refresh_token != undefined) {
        const cookieName = "refresh_token_youtube";
        const refreshToken = data.refresh_token;
        
        document.cookie = `${cookieName}=${refreshToken}; Path=/; Secure; SameSite=Lax; Max-Age=3600`;
    }

    return accessToken;
}

function getIframeSrc(iframe: string) {
    const regex = /src="([^"]+)"/;
    const match = iframe.match(regex);
    return match ? 'https://' + match[1] : null;
}

export async function getTracks(query: string, limit: number, developing: boolean = false): Promise<Record<string, string>[]> {
    const accessToken = await getToken("access_token_youtube");

    if (!accessToken) {
        console.error('No access token found');
        return [];
    }

    let url = searchURL;

    url += "?part=snippet";
    url += "&q=" +  encodeURIComponent(query);
    url += "&type=video";
    url += `&maxResults=${limit}`;
    url += "&videoDuration=medium";
    url += "&videoEmbeddable=true";

    const tracksData = [];

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json; charset=utf-8",
        },
    })

    if (!response.ok) {
        // Need to find method of removing platform from being selectable after using up daily quota
        if (response.status === 403) {
            console.log('Quota exceeded: YouTube');
        }

        console.error(`Failed to fetch tracks: ${response.statusText}`);
        return [];
    }

    // If developing, pull data from saved files (DEVELOPMENT ONLY), else make API calls to YT
    // Purpose: saves YouTube API quota from being wasted while developing
    const data = developing ? await readFromFile("dataYT") : await response.json();
    const dataItems = developing ? await readFromFile("itemsYT") : await data.items;

    // Store data in a file (DEVELOPMENT ONLY)
    developing ? {} : writeToFile(data, "dataYT"), writeToFile(dataItems, "itemsYT");

    for (let i = 0; i < dataItems.length; i++) {
        const item = dataItems[i];

        // Get wanted metadata from video resource (embedable player and duration)
        const videoResource = developing ? await readFromFile(`video ${i}`) : await getVideo(item.id.videoId, i);

        // If videoResource is empty, video wasn't returned; go to next item
        if (videoResource.length === 0) {
            continue; // Skip to the next iteration
        }

        const player = getIframeSrc(videoResource.items[0].player.embedHtml);

        // YouTube provides duration in the form of ISO 8601. This converts it to seconds and sets final value as a string
        const durationTime = Duration.fromISO(videoResource.items[0].contentDetails.duration).as('seconds').toString();
        
        const trackObject: Record<string, string> = {
            id: item.id.videoId,
            artist: "", // TBD for YT
            title: item.snippet.title,
            album: "", // TBD for YT
            artwork: item.snippet.thumbnails, // object having "default", "medium", "high" objects with .url / .width / .height
            trackUrl: "",
            duration: durationTime,
            player: player ?? "",
        }
        
        tracksData.push(trackObject);
    }
    return tracksData;
}

export async function getVideo(id: string, index: number = 0): Promise<Record<string, string>[]> {
    const accessToken = await getToken("access_token_youtube");

    if (!accessToken) {
        console.error('No access token found');
        return [];
    }

    let url = videosURL;

    url += "?part=contentDetails,player,snippet"; // fileDetails.audioStreams[]
    url += "&id=" +  encodeURIComponent(id);
    url += "&type=video";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json; charset=utf-8",
        },
    })

    if (!response.ok) {
        // Need to find method of removing platform from being selectable after using up daily quota
        if (response.status === 403) {
            console.log('Quota exceeded: YouTube');
        }

        console.error(`Failed to fetch tracks: ${response.statusText}`);
        return [];
    }
    const data = await response.json();
    writeToFile(data, `video ${index}`);

    return data;
}