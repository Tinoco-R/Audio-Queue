import React from "react";
import Platform from "./platform";

// Returns platforms that the search will be able to use per user platform authorizations
function getLinkedPlatforms() {

}
//
function LinkablePlatforms() {
    let cardSize = 400;
    let imgSize = 300;
    return (
        <div id="AccountsGrid" style={{display: "flex", flexWrap: "wrap", flexDirection: "row", gap: "1em", justifyContent: "center"}}>
            <Platform cardSize={cardSize} imgSize={imgSize - 20}  platform="Spotify"    src="/spotify/Primary_Logo_Green_RGB.svg"      ></Platform>
            <Platform cardSize={cardSize} imgSize={imgSize + 100} platform="YouTube"    src="/youtube/yt_icon_red_digital.png"         ></Platform>
            <Platform cardSize={cardSize} imgSize={imgSize - 50}  platform="Apple Music"      src="/apple/Apple_Music_Icon_RGB_sm_073120.svg"></Platform>
            <Platform cardSize={cardSize} imgSize={imgSize + 40}  platform="SoundCloud" src="/soundcloud/soundcloud.svg"               ></Platform>
        </div>
    )
}

export default function Platforms() {
    return(
        <div>
            <h1 style={{display:"flex", justifyContent: "center", fontSize: "100px", fontFamily: "serif"}}>Linkable Platforms</h1>
            <LinkablePlatforms></LinkablePlatforms>
        </div>
    );
}