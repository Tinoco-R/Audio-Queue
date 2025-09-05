// Spotify creating and sending an authorization request
var client_id = "d6a4ad132f1e4a4299a8858f69e4b97a";
var client_secret = "fcc363b86e0d4468ba8d8075274786ee";
var redirectURI = "http://127.0.0.1:5500/src/index.html";

var tokenURL  = "https://accounts.spotify.com/api/token";
var authURL   = "https://accounts.spotify.com/authorize";
var searchURL = "https://api.spotify.com/v1/search";


function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect();
    }
}

function handleRedirect() {
    let code = getSpotifyAccessCode();
    let accessToken = fetchAccessToken(code);
    window.history.pushState("", "", redirectURI);
}

function fetchAccessToken(code) {
    let accessToken = null;
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirectURI);
    
    let authHeader = getAuthHeader();

    accessToken = callAuthorizationApi(body, authHeader);

    return accessToken;
}

function callAuthorizationApi(body, header) {
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
        console.log(data)

        if (data.access_token != undefined) {
            accessToken = data.access_token;
            localStorage.setItem("access_token", accessToken);
        }
        if (data.refresh_token != undefined) {
            refreshToken = data.refresh_token;
            localStorage.setItem("refresh_token", refreshToken);
        }
    })
    .catch(error => console.error('Error:', error));

    return accessToken;
}

function getSpotifyAccessCode() {
    let code = null;
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    code = params.get("code");
    return code;
}

function requestSpotifyAuthorization() {
    let url = authURL;

    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirectURI);
    url += "&show_dialog=true";
    url += "&scope=app-remote-control streaming user-read-private user-read-email user-modify-playback-state user-library-read user-read-playback-state";
    window.location.href = url;
}

function refreshAccessToken() {
    let header = getAuthHeader();
    let refreshToken = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refreshToken;
    body += "&client_id" + client_id;
    callAuthorizationApi(body, header);
}

function getAuthHeader() {
    return btoa(client_id + ":" + client_secret);
}

async function getProfile(accessToken) {
    accessToken = localStorage.getItem("access_token");

    const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    });
    const data = await response.json();

    console.log(data);
}

async function searchSpotify(accessToken/* , query, type */) {
    accessToken = localStorage.getItem("access_token");
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