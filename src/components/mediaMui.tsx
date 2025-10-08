import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';

const Widget = styled('div')(({ theme }) => ({
    padding: 16,
    borderRadius: 16,
    width: 343,
    maxWidth: '100%',
    margin: 'auto',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(40px)',
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(0,0,0,0.6)',
    }),
}));

const CoverImage = styled('div')({
    width: 100,
    height: 100,
    objectFit: 'cover',
    overflow: 'hidden',
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    '& > img': {
        width: '100%',
    },
});

const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
});

interface TrackObject {
  artist?: string;
  title?: string;
  album?: string;
  artwork?: string;
  urn?: string;
  trackUrl?: string;
  duration?: number;
  id?: string;
  player?: HTMLElement;
  uri?: string;
}

export default function MusicPlayerSlider() {
    const [position, setPosition] = useState(0);
    const [paused, setPaused] = useState(true);
    const [video, setVideo] = useState(false);
    const [spotifyEmbed, setSpotifyEmbed] = useState(false);
    const [iFrameSrc, setiFrameSrc] = useState("");

    function formatDuration(value: number) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    const [trackObject, setTrackObject] = useState<TrackObject>();
    const { artist, title, album, artwork, urn, trackUrl, duration, id } = trackObject || {
        artist: "Artist / Band",
        title: "Title of Track",
        album: "Long Album Name",
        artwork: "../../cuteCat.png",
        urn: "",
        trackUrl: "null",
        duration: 200,
        id: "",
    };

    useEffect(() => {        
        const listener = (event: MessageEvent) => {
            if (event.data.type === 'SKIP_TO_TRACK') {
                const { trackObject, platform } = event.data;

                // If YouTube is the platform, we need to load in its video player
                if(platform == "YouTube") {
                    setiFrameSrc(trackObject.player + "?autoplay=1");
                    setVideo(true);
                }
                else if(platform == "Spotify") {
                    setiFrameSrc("");
                    setVideo(false);
                    setSpotifyEmbed(true);
                }
                else {
                    setiFrameSrc("");
                    setVideo(false);
                    setSpotifyEmbed(false);
                }
                setPaused(true);

                const togglePlay = document.getElementById("togglePlay");
                const play = togglePlay?.className.includes("Play");

                if (play) {
                    togglePlay?.click();
                }
                
                setTimeout(() => {
                    setPosition(0);
                    setTrackObject(trackObject);
                    setPaused(false);
                }, 1);
            }
        };
        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        const audioElement = document.getElementById("audio") as HTMLAudioElement;
        
        if (!paused && audioElement) {
            audioElement.play();
            intervalId = setInterval(() => {
                setPosition((prevPosition) => {
                    let newPosition = prevPosition + 1;
                    if (newPosition >= (duration ?? 0)) {
                        newPosition = 0;
                    }

                    return newPosition;
                });
            }, 1000);

            return () => clearInterval(intervalId);
        }
        else {
            if (audioElement) {
                audioElement.pause();
            }
        }
    }, [paused, duration]);

    return (
        <Box id="boxIdMain" sx={{ overflow: 'auto', p: 3 }}>
        {video ? 
        (<iframe allow="autoplay *" id="youtubeIframe" width="640" height="360" src={iFrameSrc} style={{ border: 'solid 4px #37474F' }}></iframe>) : 
        spotifyEmbed ? (<iframe data-testid="embed-iframe" id='spotifyIframe' frameBorder={0} allowFullScreen allow="autoplay *; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src={trackUrl} style={{borderRadius: "12px", width: "100%", height: "352" }} loading="lazy"></iframe>) : 
        (<Widget className='widgetClass'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CoverImage> <img alt="" src={artwork}/></CoverImage>
                <Box sx={{ ml: 1.5, minWidth: 0 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{artist}</Typography>
                    <Typography noWrap> <b>{title}</b> </Typography>
                    <Typography noWrap sx={{ letterSpacing: -0.25 }}>{album}</Typography>
                </Box>
            </Box>
            <Slider aria-label="time-indicator" size="small" value={position} min={0} step={1} max={duration} 
            onChange={(_, value) => {
                const audioElement = document.getElementById("audio") as HTMLAudioElement;
                audioElement.currentTime = value;
                setPosition(value);

                // Song is over, play next song in queue
                if(duration && value >= duration) {

                }
            }}
            
            sx={(t) => ({
                color: 'rgba(0,0,0,0.87)',
                height: 4,
                '& .MuiSlider-thumb': {
                width: 8,
                height: 8,
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&::before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                    ...t.applyStyles('dark', {
                    boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                    }),
                },
                '&.Mui-active': {
                    width: 20,
                    height: 20,
                },
                },
                '& .MuiSlider-rail': {
                opacity: 0.28,
                },
                ...t.applyStyles('dark', {
                color: '#fff',
                }),
            })}
            />
            <Box sx={{ display: 'flex', alignItems: 'center',justifyContent: 'space-between', mt: -2, }}>
                <TinyText>{formatDuration(position)}</TinyText>
                <TinyText>-{formatDuration(duration !== undefined ? duration - position : 0)}</TinyText>
            </Box>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: -1,
                    '& svg': {
                    color: '#000',
                    ...theme.applyStyles('dark', {
                        color: '#fff',
                    }),
                    },
                })}
                >
                <IconButton aria-label="previous song">
                    <FastRewindRounded fontSize="large" />
                </IconButton>

                <IconButton aria-label={paused ? 'play' : 'pause'} onClick={() => setPaused(!paused)} id='togglePlay' className={paused ? "Pause" : "Play"}>
                    {paused ? (<PlayArrowRounded sx={{ fontSize: '3rem' }} />) : (<PauseRounded sx={{ fontSize: '3rem' }} />)}
                </IconButton>

                <IconButton aria-label="next song">
                    <FastForwardRounded fontSize="large" />
                </IconButton>
            </Box>
            <Stack
            spacing={2}
            direction="row"
            sx={(theme) => ({
                mb: 1,
                px: 1,
                '& > svg': {
                color: 'rgba(0,0,0,0.4)',
                ...theme.applyStyles('dark', {
                    color: 'rgba(255,255,255,0.4)',
                }),
                },
            })}
            alignItems="center"
            >
            <VolumeDownRounded />
            <Slider
                id="volume"
                aria-label="Volume"
                defaultValue={100}
                onChange={(_, value) => {
                    const audioElement = document.getElementById("audio") as HTMLAudioElement;
                    if (audioElement) {
                        audioElement.volume = value / 100;
                    }
                }}
                sx={(t) => ({
                color: 'rgba(0,0,0,0.87)',
                '& .MuiSlider-track': {
                    border: 'none',
                },
                '& .MuiSlider-thumb': {
                    width: 24,
                    height: 24,
                    backgroundColor: '#fff',
                    '&::before': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                    },
                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                    },
                },
                ...t.applyStyles('dark', {
                    color: '#fff',
                }),
                })}
            />
            <VolumeUpRounded />
            </Stack>
        </Widget>)}
        {video ? null : (trackUrl !== null && trackUrl !== "") && (<audio id='audio' src={trackUrl}></audio>) }
        
        </Box>
    );
}