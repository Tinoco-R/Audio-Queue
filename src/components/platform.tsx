'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material';
import Image from 'next/image';
import userAuthenticationSpotify from '@/api/platformAuthentications/spotify/connection';
import userAuthenticationYoutube from '@/api/platformAuthentications/youtube/connection';
import userAuthenticationApple from '@/api/platformAuthentications/apple/connection';
import userAuthenticationSoundcloud from '@/api/platformAuthentications/soundcloud/connection';


// Needs to check if platform already correctly authenticated before proceeding with new/refreshing authentication
function platformAuthentication(platform: string) {
    switch (platform) {
        case "Spotify":
            userAuthenticationSpotify();
            return () => console.log("Authenticating with Spotify");

        case "YouTube":
            userAuthenticationYoutube();
            return () => console.log("Authenticating with YouTube");

        case "Apple Music":
            userAuthenticationApple();
            return () => console.log("Authenticating with Apple Music");

        case "SoundCloud":
            userAuthenticationSoundcloud();
            return () => console.log("Authenticating with SoundCloud");
    }
}

interface PlatformProps {
    platform: string;
    src: string;
    children?: React.ReactNode;
    cardSize: number;
    imgSize: number;
    disabled?: boolean;
}

export default function Platform({platform, src, children, cardSize, imgSize, disabled}: PlatformProps) {
    const displayValue = disabled ? "none" : "block";
    return (
        <div style={{display: displayValue}}>
            <Button style={{borderRadius: "20%"}} onClick={platformAuthentication(platform)}>
                <Card 
                    style={{backgroundColor: "white",
                            width: `${cardSize}px`,
                            height: `${cardSize}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            borderRadius: "20%"}}
                >
                    <CardMedia>
                        <Box style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                            <Image src={src} alt={platform} width={imgSize} height={imgSize} />
                        </Box>
                    </CardMedia>
                </Card>
            </Button>
            {children}
        </div>
    );
}