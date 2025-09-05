'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material';
import Image from 'next/image';

function platformAuthentication(platform: string) {
    switch (platform) {
        case "Spotify":
            return () => console.log("Authenticating with Spotify");

        case "YouTube":
            return () => console.log("Authenticating with YouTube");

        case "Apple Music":
            return () => console.log("Authenticating with Apple Music");

        case "SoundCloud":
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