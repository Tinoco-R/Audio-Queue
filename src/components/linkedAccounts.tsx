'use client';
import React from "react";
import Platform from "./platform";
import { link } from "fs";

// Returns platforms that the search will be able to use per user platform authorizations
function getLinkedPlatforms() {
    const keys = ["access_token_spotify", "access_token_youtube", "access_token_apple_music", "access_token_soundcloud"];
    let linked = [];

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        linked[i] = localStorage.getItem(key) ? true : false;
    }

    // Final check to ensure last updated platform change becomes visible
    const platforms = ["Spotify", "YouTube", "Apple Music", "SoundCloud"];
    const lastPlatform = localStorage.getItem("last_platform");

    if (lastPlatform) {
        const platformIndex = platforms.indexOf(lastPlatform);
        linked[platformIndex] = true;
    }
    return linked;
}

// Based on whether a platform is linked or not, assign it the correct source image destination
function getPlatformSources(linkedPlatforms: boolean[]) {
    const spotifySources    = ["/spotify/Primary_Logo_Green_RGB.svg"      , "/spotify/Spotify_Primary_Logo_RGB_White.png"];
    const youtubeSources    = ["/youtube/yt_icon_red_digital.png"         , "/youtube/yt_icon_white_digital.png"];
    const appleSources      = ["/apple/Apple_Music_Icon_RGB_sm_073120.svg", "/apple/Apple_Music_Icon_wht_sm_073120.svg"];
    const soundcloudSources = ["/soundcloud/soundcloud.svg"               , "/soundcloud/cloudmark-white-transparent.png"];
    
    let sources = [spotifySources, youtubeSources, appleSources, soundcloudSources];
    let finalSources = [];

    // Loop through platforms and assign correct src (left is linked (colored), right is unlinked (white))
    for (let i = 0; i < linkedPlatforms.length; i++) {
        let src = sources[i][linkedPlatforms[i] ? 0 : 1];
        finalSources.push(src);
    }
    return finalSources;
}

// To be used in the platform linkage page
function LinkablePlatforms() {
    const cardSize = 400;
    const imgSize = 300;
    const platforms = getLinkedPlatforms();
    const platformSources = getPlatformSources(platforms);

    return (
        <div>
            <h1 style={{display:"flex", justifyContent: "center", fontSize: "100px", fontFamily: "serif"}}>Linkable Platforms</h1>
            <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "1em", justifyContent: "center"}}>
                <Platform linked={platforms[0]} cardSize={cardSize} imgSize={imgSize - 20}  platform="Spotify"     src={platformSources[0]}></Platform>
                <Platform linked={platforms[1]} cardSize={cardSize} imgSize={imgSize + 100} platform="YouTube"     src={platformSources[1]}></Platform>
                <Platform linked={platforms[2]} cardSize={cardSize} imgSize={imgSize - 50}  platform="Apple Music" src={platformSources[2]}></Platform>
                <Platform linked={platforms[3]} cardSize={cardSize} imgSize={imgSize + 40}  platform="SoundCloud"  src={platformSources[3]}></Platform>
            </div>
        </div>
    )
}

// To be used in the media search page
function SelectablePlatforms() {
    const cardSize = 66;
    const imgSize = 50;
    const platforms = getLinkedPlatforms();

    return (
        <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "0.25em", justifyContent: "center"}}>
            <Platform disabled={platforms[0]} cardSize={cardSize} imgSize={imgSize}  platform="Spotify"     src="/spotify/Spotify_Primary_Logo_RGB_Black.png"></Platform>
            <Platform disabled={platforms[1]} cardSize={cardSize} imgSize={imgSize}  platform="YouTube"     src="/youtube/youtube.svg"                       ></Platform>
            <Platform disabled={platforms[2]} cardSize={cardSize} imgSize={imgSize}  platform="Apple Music" src="/apple/Apple_Music_Icon_blk_sm_073120.svg"  ></Platform>
            <Platform disabled={platforms[3]} cardSize={cardSize} imgSize={imgSize}  platform="SoundCloud"  src="/soundcloud/soundcloud.svg"                 ></Platform>
        </div>
    )
}

export { LinkablePlatforms };
export default LinkablePlatforms;

export { SelectablePlatforms };