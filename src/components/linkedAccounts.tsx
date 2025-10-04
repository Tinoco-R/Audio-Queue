'use client';
import React from "react";
import Platform from "./platform";

// Returns platforms that the search will be able to use per user platform authorizations
function getLinkedPlatforms(returnDisabled = false) {
    if (typeof window === 'undefined') {
        return [false, false, false, false];
    }

    const keys = ["access_token_spotify", "access_token_youtube", "access_token_apple_music", "access_token_soundcloud"];
    const linked = [];

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        linked[i] = localStorage.getItem(key) ? true : false;
    }

    return !returnDisabled ? linked : linked.map(v => !v);
}

// Based on whether a platform is linked or not, assign it the correct source image destination
function getPlatformSources(linkedPlatforms: boolean[]) {
    const spotifySources    = ["/spotify/Primary_Logo_Green_RGB.svg"      , "/spotify/Spotify_Primary_Logo_RGB_White.png"];
    const youtubeSources    = ["/youtube/yt_icon_red_digital.png"         , "/youtube/yt_icon_white_digital.png"];
    const appleSources      = ["/apple/Apple_Music_Icon_RGB_sm_073120.svg", "/apple/Apple_Music_Icon_wht_sm_073120.svg"];
    const soundcloudSources = ["/soundcloud/soundcloud.svg"               , "/soundcloud/cloudmark-white-transparent.png"];
    
    const sources = [spotifySources, youtubeSources, appleSources, soundcloudSources];
    const finalSources = [];

    // Loop through platforms and assign correct src (left is linked (colored), right is unlinked (white))
    for (let i = 0; i < linkedPlatforms.length; i++) {
        const src = sources[i][linkedPlatforms[i] ? 0 : 1];
        finalSources.push(src);
    }
    return finalSources;
}

// To be used in the platform linkage page
function LinkablePlatforms() {
    const cardSize = 400;
    const imgSize = 300;
    const linkedPlatforms = getLinkedPlatforms();
    const platformSources = getPlatformSources(linkedPlatforms);

    return (
        <div>
            <h1 style={{display:"flex", justifyContent: "center", fontSize: "100px", fontFamily: "serif"}}>Linkable Platforms</h1>
            <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "1em", justifyContent: "center"}}>
                <Platform linked={linkedPlatforms[0]} cardSize={cardSize} imgSize={imgSize - 20}  platform="Spotify"     src={platformSources[0]}></Platform>
                <Platform linked={linkedPlatforms[1]} cardSize={cardSize} imgSize={imgSize + 100} platform="YouTube"     src={platformSources[1]}></Platform>
                <Platform linked={linkedPlatforms[2]} cardSize={cardSize} imgSize={imgSize - 50}  platform="Apple Music" src={platformSources[2]}></Platform>
                <Platform linked={linkedPlatforms[3]} cardSize={cardSize} imgSize={imgSize + 40}  platform="SoundCloud"  src={platformSources[3]}></Platform>
            </div>
        </div>
    )
}

// To be used in the platform linkage page
function LinkablePlatformsSkeleton() {
    const cardSize = 400;
    const imgSize = 300;

    return (
        <div>
            <h1 style={{display:"flex", justifyContent: "center", fontSize: "100px", fontFamily: "serif"}}>Linkable Platforms</h1>
            <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "1em", justifyContent: "center"}}>
                <Platform cardSize={cardSize} imgSize={imgSize - 20}  platform="Spotify"     src="null" selectable={true} ></Platform>
                <Platform cardSize={cardSize} imgSize={imgSize + 100} platform="YouTube"     src="null" selectable={true} ></Platform>
                <Platform cardSize={cardSize} imgSize={imgSize - 50}  platform="Apple Music" src="null" selectable={true} ></Platform>
                <Platform cardSize={cardSize} imgSize={imgSize + 40}  platform="SoundCloud"  src="null" selectable={true} ></Platform>
            </div>
        </div>
    )
}

// To be used in the media search page
function SelectablePlatforms() {
    const cardSize = 66;
    const imgSize = 50;
    const linkedPlatforms = getLinkedPlatforms();
    const disabledPlatforms = getLinkedPlatforms(true);

    return (
        <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "0.25em", justifyContent: "center"}}>
            <Platform linked={linkedPlatforms[0]} disabled={disabledPlatforms[0]} selectable={true} cardSize={cardSize} imgSize={imgSize}      platform="Spotify"     src="/spotify/Spotify_Primary_Logo_RGB_Black.png" altSrc="/spotify/Spotify_Primary_Logo_RGB_White.png"></Platform>
            <Platform linked={linkedPlatforms[1]} disabled={disabledPlatforms[1]} selectable={true} cardSize={cardSize} imgSize={imgSize + 20} platform="YouTube"     src="/youtube/yt_icon_almostblack_digital.png"    altSrc="/youtube/yt_icon_white_digital.png"></Platform>
            <Platform linked={linkedPlatforms[2]} disabled={disabledPlatforms[2]} selectable={true} cardSize={cardSize} imgSize={imgSize}      platform="Apple Music" src="/apple/Apple_Music_Icon_blk_sm_073120.svg"   altSrc="/apple/Apple_Music_Icon_wht_sm_073120.svg"></Platform>
            <Platform linked={linkedPlatforms[3]} disabled={disabledPlatforms[3]} selectable={true} cardSize={cardSize} imgSize={imgSize + 8}  platform="SoundCloud"  src="/soundcloud/soundcloud.svg"                  altSrc="/soundcloud/cloudmark-white-transparent.png"></Platform>
        </div>
    )
}

export { LinkablePlatforms, LinkablePlatformsSkeleton, SelectablePlatforms };
export default LinkablePlatforms;