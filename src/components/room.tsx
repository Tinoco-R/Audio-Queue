'use client';
import * as React from 'react';
import SearchTop from './searchtop';
import { SearchResults } from './searchtop';
import MusicPlayerSlider from './mediaMui';
import Queue from './queue';
import Attendees from './attendees';
import Grid from '@mui/material/Grid';
import { Item } from './item';


interface RoomProps{
    children?: React.ReactNode;
};

export default function Room({children}: RoomProps) {
    return(
        <div>
            <h1 style={{display: "flex", justifyContent: "center", fontSize: 100}}>Room</h1>
            {/*General Room container*/}
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Item>
                        <SearchTop></SearchTop>
                    </Item>
                    <br></br>
                    <Item>
                        <SearchResults></SearchResults>
                    </Item>
                </Grid>


                <Grid size={6}>
                    <Item>
                        <MusicPlayerSlider></MusicPlayerSlider>
                    </Item>
                </Grid>


                <Grid size={6}>
                    <Item>
                        <Queue></Queue>
                    </Item>
                </Grid>


                <Grid size={6}>
                    <Item>
                        <Attendees></Attendees>
                    </Item>
                </Grid>
            </Grid>

            {children}
        </div>
    );
}