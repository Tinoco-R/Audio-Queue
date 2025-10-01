'use client'

// Soundcloud creating and sending an authorization request
const public_key = process.env.NEXT_PUBLIC_KEY_YT;
const client_id = process.env.NEXT_PUBLIC_AUTH_YOUTUBE_CLIENT;
const client_secret = process.env.NEXT_PUBLIC_AUTH_YOUTUBE_CLIENT_SECRET;

const redirectURI = "http://127.0.0.1:3000/linkPlatforms/youtube";
const authURL   = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenURL = "https://oauth2.googleapis.com/token";
const scope = "https://www.googleapis.com/auth/youtube.readonly"

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
    url += "&redirect_uri=" + encodeURI(redirectURI);
    url += "&response_type=code";
    url += "&scope=" + scope;
    window.location.href = url;
}

export function handleRedirectYoutube() {
    const [code, scope] = getAccessCodeAndScope();
    const accessToken = fetchAccessToken(code);
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

function fetchAccessToken(code: string | null) {
    let accessToken = null;

    let body = "grant_type=authorization_code";
    body += "&redirect_uri=" + encodeURI(redirectURI);
    body += "&code=" + code;
    body += "&client_id=" + client_id
    body += "&client_secret=" + client_secret

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
            localStorage.setItem("access_token_youtube", accessToken);
        }
        if (data.refresh_token != undefined) {
            const refreshToken = data.refresh_token;
            localStorage.setItem("refresh_token_youtube", refreshToken);
        }
    })
    .catch(error => console.error('Error:', error));

    return accessToken;
}

async function generalGet(url: string) {
    const accessToken = localStorage.getItem("access_token_youtube");
    
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    });
    const data = await response.json();

    console.log(data);
}