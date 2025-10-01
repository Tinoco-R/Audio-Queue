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
            return () =>  userAuthenticationSpotify();

        case "YouTube":
            return () =>  userAuthenticationYoutube();

        case "Apple Music":
            return () =>  userAuthenticationApple();

        case "SoundCloud":
            return () =>  userAuthenticationSoundcloud();
    }
}

interface PlatformProps {
    platform: string;
    src: string;
    children?: React.ReactNode;
    cardSize: number;
    imgSize: number;
    disabled?: boolean;
    linked?: boolean;
}

export default function Platform({platform, src, children, cardSize, imgSize, disabled, linked}: PlatformProps) {
    const displayValue = disabled ? "none" : "block";
    const linkedValue  = linked   ? false : true;

    return (
        <div style={{display: displayValue}}>
            <Button style={{borderRadius: "20%"}} onClick={platformAuthentication(platform)}>
                <Card 
                    style={{backgroundColor: linked ? "white" : "black",
                            width: `${cardSize}px`,
                            height: `${cardSize}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            borderRadius: "20%"}}
                >
                    <CardMedia>
                        <Box style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                            <Image src={src} priority={true} alt={platform} width={imgSize} height={imgSize} />
                        </Box>
                    </CardMedia>
                </Card>
            </Button>
            {children}
        </div>
    );
}