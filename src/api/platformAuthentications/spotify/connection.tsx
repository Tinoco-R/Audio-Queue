// Spotify creating and sending an authorization request
const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

const redirectURI = "http://127.0.0.1:3000/linkPlatforms/spotify";
const tokenURL  = "https://accounts.spotify.com/api/token";
const authURL   = "https://accounts.spotify.com/authorize";
const searchURL = "https://api.spotify.com/v1/search";

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
    url += "&redirect_uri=" + encodeURI(redirectURI);
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
    body += "&redirect_uri=" + encodeURI(redirectURI);
    
    let authHeader = getAuthHeader();

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

    console.log("Data", data);

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
    let header = getAuthHeader();
    let refreshToken = localStorage.getItem("refresh_token_spotify");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refreshToken;
    body += "&client_id" + client_id;
    callAuthorizationApi(body, header);
}

async function getProfile(accessToken: string | null) {
    accessToken = localStorage.getItem("access_token_spotify");

    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    });
    const data = await response.json();

    console.log(data);
}

async function searchSpotify(accessToken: string | null) {
    accessToken = localStorage.getItem("access_token_spotify");
    let query = "q=Glass Heart";
    let type = "track";
    let include_external = "audio";

    let url = searchURL;
    url += "?q=" + encodeURIComponent(query);
    url += "&type=" + encodeURIComponent(type);
    url += "&include_external=" + include_external;

    const response = await fetch(url, {
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    });

    const data = await response.json();

    console.log(data);
}