'use client';
import React from "react";
import Platform from "./platform";

// Returns platforms that the search will be able to use per user platform authorizations
function getLinkedPlatforms() {
    return([false, false, false, false]);
}

// To be used in the platform linkage page
function LinkablePlatforms() {
    const cardSize = 400;
    const imgSize = 300;
    return (
        <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "1em", justifyContent: "center"}}>
            <Platform cardSize={cardSize} imgSize={imgSize - 20}  platform="Spotify"     src="/spotify/Primary_Logo_Green_RGB.svg"      ></Platform>
            <Platform cardSize={cardSize} imgSize={imgSize + 100} platform="YouTube"     src="/youtube/yt_icon_red_digital.png"         ></Platform>
            <Platform cardSize={cardSize} imgSize={imgSize - 50}  platform="Apple Music" src="/apple/Apple_Music_Icon_RGB_sm_073120.svg"></Platform>
            <Platform cardSize={cardSize} imgSize={imgSize + 40}  platform="SoundCloud"  src="/soundcloud/soundcloud.svg"               ></Platform>
        </div>
    )
}

// To be used in the media search page
function SelectablePlatforms() {
    const cardSize = 66;
    const imgSize = 50;

    let platforms = getLinkedPlatforms();

    return (
        <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "0.25em", justifyContent: "center"}}>
            <Platform disabled={platforms[0]} cardSize={cardSize} imgSize={imgSize}  platform="Spotify"     src="/spotify/Spotify_Primary_Logo_RGB_Black.png"></Platform>
            <Platform disabled={platforms[1]} cardSize={cardSize} imgSize={imgSize}  platform="YouTube"     src="/youtube/youtube.svg"                       ></Platform>
            <Platform disabled={platforms[2]} cardSize={cardSize} imgSize={imgSize}  platform="Apple Music" src="/apple/Apple_Music_Icon_blk_sm_073120.svg"  ></Platform>
            <Platform disabled={platforms[3]} cardSize={cardSize} imgSize={imgSize}  platform="SoundCloud"  src="/soundcloud/soundcloud.svg"                 ></Platform>
        </div>
    )
}

function PlatformsLink() {
    return(
        <div>
            <LinkablePlatforms></LinkablePlatforms>
        </div>
    );
}

function PlatformsSelect() {
    return(
        <div>
            <SelectablePlatforms></SelectablePlatforms>
        </div>
    );
}

export { LinkablePlatforms };
export default LinkablePlatforms;

export { SelectablePlatforms };