import { readFromFile, writeToFile } from "../youtube/fileHandling";

// Spotify creating and sending an authorization request
const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

const redirectURI = "https://www.audioqueue.dev/linkPlatforms/spotify";
const redirectURILocalHost = "http://127.0.0.1:3000/linkPlatforms/spotify";
const tokenURL  = "https://accounts.spotify.com/api/token";
const authURL   = "https://accounts.spotify.com/authorize";
const searchURL = "https://api.spotify.com/v1/search";

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
    requestSpotifyAuthorization();
}

function requestSpotifyAuthorization() {
    localStorage.setItem("last_platform", "Spotify");
    let url = authURL;

    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(getRedirectURI());
    url += "&show_dialog=true";
    url += "&scope=app-remote-control streaming user-read-private user-read-email user-modify-playback-state user-library-read user-read-playback-state";
    window.location.href = url;
}

export async function handleRedirectSpotify() {
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
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(getRedirectURI());
    
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
        accessToken = data.access_token;
        localStorage.setItem("access_token_spotify", accessToken);
    }
    if (data.refresh_token != undefined) {
        const refreshToken = data.refresh_token;
        localStorage.setItem("refresh_token_spotify", refreshToken);
    }

    return accessToken;
}

function refreshAccessToken() {
    const header = getAuthHeader();
    const refreshToken = localStorage.getItem("refresh_token_spotify");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refreshToken;
    body += "&client_id" + client_id;
    callAuthorizationApi(body, header);
}

export async function getTracks(query: string, limit: number, developing: boolean = false): Promise<Record<string, string>[]> {
    const accessToken = localStorage.getItem("access_token_spotify");
    
    if (!accessToken) {
        console.error('No access token found');
        return [];
    }

    let url = searchURL;
    url += "?q=" + encodeURIComponent(query);
    url += "&type=track";
    url += "&include_external=audio";
    url += "&limit=" + encodeURIComponent(limit);;

    const response = await fetch(url, {
        headers: {
            Authorization: "Bearer " + accessToken,
            "Accept": "application/json; charset=utf-8",
        },
    });

    if (!response.ok) {
        // Need to find method of removing platform from being selectable after using up daily quota
        if (response.status === 429) {
            console.log('Quota exceeded: Spotify');
        }
        console.error(`Failed to fetch tracks: ${response.statusText}`);
        return [];
    }

    // If developing, pull data from saved files (DEVELOPMENT ONLY), else make API calls to YT
    // Purpose: saves YouTube API quota from being wasted while developing
    const data = developing ? await readFromFile("dataSpotify") : await response.json();
    const dataItems = developing ? await readFromFile("itemsSpotify") : await data.tracks.items;

    // Store data in a file (DEVELOPMENT ONLY)
    developing ? {} : writeToFile(data, "dataSpotify"), writeToFile(dataItems, "itemsSpotify");
    
    const tracksData = [];
    for (let i = 0; i < dataItems.length; i++) {
        const item = dataItems[i];

        // Get artists names
        const artists = item.artists;
        let artistNames = "";
        for (let i = 0; i < artists.length; i++) {
            if(i > 0) {
                artistNames += ", ";
            }
            const artistName = artists[i].name;
            artistNames += artistName;
        }
        
        const trackObject: Record<string, string> = {
            id: item.id,
            artist: artistNames,
            title: item.name,
            album: item.album.name,
            artwork: item.album.images[0].url, // 3 options (biggest -> smallest) height / width / url
            //trackUrl: item.uri,
            //trackUrl: item.external_urls.spotify,
            trackUrl: `https://open.spotify.com/embed/track/${item.id}?utm_source=generator`,
            uri: item.uri,
            duration: Math.floor(item.duration_ms / 1000).toString(),
        }
        tracksData.push(trackObject);
    }
    return tracksData;
}