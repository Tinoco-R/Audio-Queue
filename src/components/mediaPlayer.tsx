import * as React from 'react';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import { Item, ItemBlack } from './item';
import LinearDeterminate from './linearProgress';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

interface MediaPlayerProps{
    children?: React.ReactNode;
};

export default function MediaPlayer({children}: MediaPlayerProps) {
    const imgSize = 500;
    return(
        <div style={{display: "flex", flexDirection: "column", flexWrap: "wrap", alignItems: "center"}}>
            <Image id='mediaImage' src={"../../globe.svg"} alt={"Album/Song Name"} width={imgSize} height={imgSize} />
            
            <div id="songInfo" style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                <div id='songText' style={{ display: "flex", flexDirection: "column", alignItems: "start"}}>
                    <p id="title" style={{height: "0px", fontWeight: "bold"}}>Title</p>
                    <p id="artist" style={{fontWeight: "lighter"}}>Artist</p>
                </div>

                <div id='progress'>
                    <div id='bar'>
                        <LinearDeterminate></LinearDeterminate>
                    </div>
                    <div id='songTimes' style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", height: "auto" }}>
                        <p id="timeElapsed">0:00</p>
                        <p id="songLength">5:21</p>
                    </div>
                    <div id="progressPoint"></div>
                </div>
            </div>

            <div id='mediaButtons'>
                <SkipPreviousIcon fontSize='large'></SkipPreviousIcon>
                <PauseCircleFilledIcon fontSize='large'></PauseCircleFilledIcon>
                <SkipNextIcon fontSize='large'></SkipNextIcon>
            </div>

            {children}
        </div>
    );
}