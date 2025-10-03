'use client'

import { generateCodeVerifier, createCodeChallenge, setValueIfNotExists } from "./codeChallenge";

// Soundcloud creating and sending an authorization request
const client_id = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT;
const client_secret = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_SECRET;

//const redirectURI = "http://127.0.0.1:3000/linkPlatforms/soundcloud";
const redirectURI = "https://www.audioqueue.dev/linkPlatforms/soundcloud";
const authURL     = "https://secure.soundcloud.com/authorize";
const tokenURL    = "https://secure.soundcloud.com/oauth/token";
const trackURL    = "https://api.soundcloud.com/tracks";

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
    url += "&redirect_uri=" + encodeURI(redirectURI);
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
    body += "&redirect_uri=" + encodeURI(redirectURI);
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

    console.log("Data", data);

    if (data.access_token != undefined) {
        accessToken = data.access_token;
        localStorage.setItem("access_token_soundcloud", accessToken);
    }
    if (data.refresh_token != undefined) {
        const refreshToken = data.refresh_token;
        localStorage.setItem("refresh_token_soundcloud", refreshToken);
    }

    return accessToken;
}

export async function getTracks(query: string): Promise<{[key: string]: any }[]> {
    const accessToken = localStorage.getItem("access_token_soundcloud");

    if (!accessToken) {
        console.error('No access token found');
        return [];
    }

    let url = trackURL;

    url += "?q=" + encodeURIComponent(query);
    url += "&access=playable";
    url += "&limit=5";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json; charset=utf-8",
        },
    })

    if (!response.ok) {
            console.error(`Failed to fetch tracks: ${response.statusText}`);
            return [];
        }

    const data = await response.json();
    const tracksData = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const trackObject: Record<string, string> = {
            artist: item.user.username,
            title: item.title,
            album: "", // TBD for soundcloud (perhaps use other service etc.)
            artwork: item.artwork_url,
            urn: item.urn,
            trackUrl: await getStreamableUrl(item.urn)
        }
        tracksData.push(trackObject);
    }    
    return tracksData;
}

export async function getStreamableUrl(urn: string): Promise<string> {
    const accessToken = localStorage.getItem("access_token_soundcloud");

    if (!accessToken) {
        console.error('No access token found');
        return "-1";
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
        console.error(`Failed to fetch streamable URL: ${response.statusText}`);
        return "-1";
    }

    // Returns urls of type: http_mp3_128_url, hls_mp3_128_url, hls_opus_64_url, as well as preview
    const data = await response.json();
    const http_mp3_128_url    = data.http_mp3_128_url;
    const hls_mp3_128_url     = data.hls_mp3_128_url;
    const hls_opus_64_url     = data.hls_opus_64_url;
    const preview_mp3_128_url = data.preview_mp3_128_url;

    return http_mp3_128_url;
}