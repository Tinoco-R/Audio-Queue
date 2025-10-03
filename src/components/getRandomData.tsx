'use client';
import { Grid } from "@mui/material";
import { Item, ItemBlack } from "./item";
import Platform from "./platform";

// DEVELOPMENT ONLY TESTING (REMOVE)
function getRandomSongName(): string {
  const songNames = ["Cool Song", "Rockstar", "Electric Dreams", "Lost in Music"];
  const bandNames = ["Some Band", "Guitar Heroes", "Riff Masters", "Melody Makers"];

  return `${songNames[Math.floor(Math.random() * songNames.length)]} - ${bandNames[Math.floor(Math.random() * bandNames.length)]}`;
}

// DEVELOPMENT ONLY TESTING (REMOVE)
function getRandomPlatform() {
  const randomNumber = Math.floor(Math.random() * 4);
  const cardSize=33;
  const imgSize=25;
  
  switch(randomNumber) {
    case 0:
      return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize} platform="Spotify" src="/spotify/Spotify_Primary_Logo_RGB_White.png" />;
    
    case 1:
      return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize + 10} platform="YouTube" src="/youtube/yt_icon_white_digital.png" />;
    
    case 2:
      return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize} platform="Apple Music" src="/apple/Apple_Music_Icon_wht_sm_073120.svg" />;
    
    case 3:
      return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize + 10} platform="SoundCloud" src="/soundcloud/cloudmark-white-transparent.png" />;
    
    default:
      return null;
  }
}

export default function generateResultRandom() {
    const left = 10;
    const right = 12 - left;
    return(
        <Grid container direction={"row"} display={"flex"}>
            <Grid size={left}>
                <Item style={{display: "flex", justifyContent: "flex-start",  alignItems: "center", fontSize: 30, height: "40%"}}>
                    {getRandomSongName()}
                </Item>
            </Grid>
            <Grid size={right}>
                <ItemBlack style={{display: "flex", justifyContent: "center", alignItems: "center", height: "40%"}}>
                    {getRandomPlatform()}
                </ItemBlack>
            </Grid>
        </Grid>
    );
}