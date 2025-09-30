'use client'

import { generateCodeVerifier, createCodeChallenge, setValueIfNotExists } from "./codeChallenge";

// Soundcloud creating and sending an authorization request
const client_id = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT;
const client_secret = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_SECRET;

const redirectURI = "http://127.0.0.1:3000/linkPlatforms/soundcloud";
const authURL   = "https://secure.soundcloud.com/authorize";
const tokenURL = "https://secure.soundcloud.com/oauth/token";

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

export function handleRedirectSoundcloud() {
    const code = getAccessCode();
    const accessToken = fetchAccessToken(code);
}

function getAccessCode() {
    let code = null;
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    code = params.get("code");
    return code;
}

function fetchAccessToken(code: string | null) {
    console.log("Fetching access token with code:", code)
    let accessToken = null;

    const code_verifier = localStorage.getItem("code_verifier");
    localStorage.removeItem("code_verifier");

    let body = "grant_type=authorization_code";
    body += "&client_id=" + client_id
    body += "&client_secret=" + client_secret
    body += "&redirect_uri=" + encodeURI(redirectURI);
    body += "&code_verifier=" + code_verifier;
    body += "&code=" + code;

    let authHeader = getAuthHeader();
    
    accessToken = callAuthorizationApi(body, authHeader);

    return accessToken;
}

function callAuthorizationApi(body: string, header: string) {
    let accessToken = null;
    fetch(tokenURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + header,
        },
        body: body
    })
    .then(response => response.json())
    .then(data => {
        console.log("Data", data)
        if (data.access_token != undefined) {
            accessToken = data.access_token;
            localStorage.setItem("access_token_soundcloud", accessToken);
        }
        if (data.refresh_token != undefined) {
            const refreshToken = data.refresh_token;
            localStorage.setItem("refresh_token_soundcloud", refreshToken);
        }
    })
    .catch(error => console.error('Error:', error));

    return accessToken;
}