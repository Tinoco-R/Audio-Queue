'use client';
import * as React from 'react';
import SearchTop from './searchtop';
import MediaPlayer from './mediaPlayer';
import Queue from './queue';
import Attendees from './attendees';
import Grid from '@mui/material/Grid';
import { Item, ItemBlack } from './item';
import { SelectablePlatforms } from './linkedAccounts';
import Platform from './platform';
import SearchResults from './searchResults';

function getSearchResults(query: string, platforms: boolean[]) {

}

interface RoomProps{
    children?: React.ReactNode;
};

var client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
var client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
console.log("Client ID: ", client_id, "Client Secret:", client_secret);

export default function Room({children}: RoomProps) {
    return(
        <div>
            {/*General Room container*/}
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Item>
                        <SearchTop></SearchTop>
                    </Item>
                    
                    {/*Search results (left) and used platform container (right)*/}    
                    <SearchResults></SearchResults>                
                </Grid>

                <Grid size={6}>
                    <Item>
                        <MediaPlayer></MediaPlayer>
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