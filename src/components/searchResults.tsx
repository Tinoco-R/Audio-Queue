'use client';
import { Grid, IconButton} from "@mui/material";
import { Item, ItemBlack } from "./item";
import Platform from "./platform";
import CancelIcon from '@mui/icons-material/Cancel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
        main: '#ff3535ff',
        },
    },
});

function removeButton() {
    return(
        <ThemeProvider theme={theme}>
            <IconButton color="primary" className="remove" aria-label="cancel">
                <CancelIcon className="remove"/>
            </IconButton>
        </ThemeProvider>
    );
}

function getPlatformLogo(platform: string) {
    const cardSize=33;
    const imgSize=25;
  
    switch(platform) {
        case "Spotify":
        return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize} platform="Spotify" src="/spotify/Spotify_Primary_Logo_RGB_White.png" />;
        
        case "YouTube":
        return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize + 10} platform="YouTube" src="/youtube/yt_icon_white_digital.png" />;
        
        case "Apple Music":
        return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize} platform="Apple Music" src="/apple/Apple_Music_Icon_wht_sm_073120.svg" />;
        
        case "SoundCloud":
        return <Platform disabled={false} display={true} cardSize={cardSize} imgSize={imgSize + 10} platform="SoundCloud" src="/soundcloud/cloudmark-white-transparent.png" />;
        
        default:
        return null;
    }
}

export default function generateResult(platform: string, trackObject: Record<string, string>, isQueueResult: boolean = false) {
    const artist    = trackObject.artist;
    const title     = trackObject.title;
/*
    const album     = trackObject.album;
    const artwork   = trackObject.artwork;
    const urn       = trackObject.urn;
    const trackUrl  = trackObject.trackUrl;
    const duration  = trackObject.duration;
*/

    const left = 10;
    const right = 12 - left;
    const height = "60%";

    return(
        <Grid container direction={"row"} display={"flex"}>
            <Grid size={left}>
                <Item className="trackMetadataParent" style={{display: "flex", justifyContent: "flex-start",  alignItems: "center", fontSize: 20, height: height}}>
                    {`${title} - ${artist}`}
                </Item>
            </Grid>
            <Grid size={right}>
                <ItemBlack id="logoParent" className="logoParent" style={{display: "flex", justifyContent: "center", alignItems: "center", height: height}}>
                    {getPlatformLogo(platform)}
                    {isQueueResult? removeButton() : ""}
                </ItemBlack>
            </Grid>
        </Grid>
    );
}