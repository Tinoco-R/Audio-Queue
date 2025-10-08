'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material';
import CircularIndeterminate from "./loadingCircle";
import Image from 'next/image';
import userAuthenticationSpotify from '@/api/platformAuthentications/spotify/connection';
import userAuthenticationYoutube from '@/api/platformAuthentications/youtube/connection';
import userAuthenticationApple from '@/api/platformAuthentications/apple/connection';
import userAuthenticationSoundcloud from '@/api/platformAuthentications/soundcloud/connection';
import { useState } from 'react';

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
    altSrc?: string;
    children?: React.ReactNode;
    cardSize: number;
    imgSize: number;
    disabled?: boolean;
    linked?: boolean;
    selectable?: boolean;
    display?: boolean;
}

export default function Platform({platform, src, altSrc, children, cardSize, imgSize, disabled, linked, selectable, display}: PlatformProps) {
    const displayValue = disabled ? "none" : "block";
   
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isSelected, setSelected] = useState("");
    const alt = altSrc ? altSrc : "";

    function setNewSrc(newSrc: string, selected: string) {
        setSelected(selected);
        setCurrentSrc(newSrc);
    }

    function switchSourceHandler() {
        if (currentSrc == src) {
            setNewSrc(alt, "Active");
        }
        else {
            setNewSrc(src, "");
        }
        return () => {};
    };

    const renderImage = () => {
        if (src === "null" || src === "") {
            return <CircularIndeterminate></CircularIndeterminate>;
        }
        return (
            <Box style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <Image src={currentSrc} priority={true} alt={platform} width={imgSize} height={imgSize} />
            </Box>
        );
    };

    return (
        <div style={{display: displayValue}} className={`Platform ${platform} ${isSelected}`}>
            <Button style={{borderRadius: "20%"}} disabled={display} onClick={selectable ? switchSourceHandler : platformAuthentication(platform)}>
                <Card 
                    style={{backgroundColor: linked && currentSrc === src ? "white" : "black",
                            width: `${cardSize}px`,
                            height: `${cardSize}px`,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            borderRadius: "20%"}}
                >
                    <CardMedia>
                        <Box style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                            {renderImage()}
                        </Box>
                    </CardMedia>
                </Card>
            </Button>
            {children}
        </div>
    );
}