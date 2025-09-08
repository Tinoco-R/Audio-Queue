'use client';
import { SelectablePlatforms } from "./linkedAccounts";
import { Grid } from "@mui/material";
import { Item, ItemBlack } from "./item";
import Platform from "./platform";

function getRandomSongName(): string {
  const songNames = ["Cool Song", "Rockstar", "Electric Dreams", "Lost in Music"];
  const bandNames = ["Some Band", "Guitar Heroes", "Riff Masters", "Melody Makers"];

  return `${songNames[Math.floor(Math.random() * songNames.length)]} - ${bandNames[Math.floor(Math.random() * bandNames.length)]}`;
}

function getRandomPlatform() {
  const randomNumber = Math.floor(Math.random() * 4);
  const cardSize=33;
  const imgSize=25;
  
  switch(randomNumber) {
    case 0:
      return <Platform disabled={false} cardSize={cardSize} imgSize={imgSize} platform="Spotify" src="/spotify/Spotify_Primary_Logo_RGB_Black.png" />;
    
    case 1:
      return <Platform disabled={false} cardSize={cardSize} imgSize={imgSize} platform="YouTube" src="/youtube/youtube.svg" />;
    
    case 2:
      return <Platform disabled={false} cardSize={cardSize} imgSize={imgSize} platform="Apple Music" src="/apple/Apple_Music_Icon_blk_sm_073120.svg" />;
    
    case 3:
      return <Platform disabled={false} cardSize={cardSize} imgSize={imgSize} platform="SoundCloud" src="/soundcloud/soundcloud.svg" />;
    
    default:
      // If no case matches, return null or throw an error
      return null;
  }
}

function generateResult() {
    const left = 10;
    const right = 12 - left;
    return(
        <Grid container direction={"row"} display={"flex"}>
            <Grid size={left}>
                <Item style={{display: "flex", justifyContent: "flex-start",  alignItems: "center", fontSize: 40, height: "40%"}}>
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

interface SearchResultsProps{
    children?: React.ReactNode;
};

export default function SearchResults({children}: SearchResultsProps) {


    console.log('SearchResults rendered');
    return(
        <div>
            {generateResult()}
            {generateResult()}
            {generateResult()}
            {generateResult()}
            {generateResult()}
            {children}
        </div>
    );
}