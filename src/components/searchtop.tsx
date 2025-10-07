'use client';
import React, { useState } from 'react';
import { SelectablePlatforms } from "./linkedAccounts";
import { getTracks as getTracksSpotify } from '@/api/platformAuthentications/spotify/connection';
import { getTracks as getTracksYoutube } from '@/api/platformAuthentications/youtube/connection';
import { getTracks as getTracksAppleMusic } from '@/api/platformAuthentications/apple/connection';
import { getTracks as getTracksSoundcloud } from '@/api/platformAuthentications/soundcloud/connection';
import generateResult from './searchResults';
import { createRoot, Container  } from 'react-dom/client';
import { addToQueue } from './queue';

interface SearchTopProps{
    children?: React.ReactNode;
};

export default function SearchTop({children}: SearchTopProps) {
    const [inputValue, setInputValue] = useState('');
    const [isEnterPressed, setIsEnterPressed] = useState(false);

    // Finds and returns selected platforms via class name
    function getSelectedPlatforms() {
        const selected: string[] = [];
        const platforms = Array.from(document.querySelectorAll('[class*="Active"]')).map(el => el.className);

        platforms.forEach(platform => {
            const platformName = platform.replace(/Active$/, '').trim().replace("Platform ", '');
            selected.push(platformName);
        });

        return selected;
    }

    // Removes previous search results to make room for a new search
    function clearSearchResults() {
        const searchResultsParent = document.getElementById("searchResultsParent") as HTMLElement;

        const children = searchResultsParent.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            while (child.firstChild) {
                child.removeChild(child.firstChild);
            }
        }
    }

    // Renders tracks for the client
    async function renderTracks(platform: string, tracks: Record<string, string>[]) {
        // Generate Search Results
        const parent  = document.getElementById(`searchResultsParent${platform}`);

        // Render search results
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const result = generateResult(platform, track);

            // Creates a child node to render result onto
            const childNode = await document.createElement('div');
            childNode.id = `${platform}SearchResult${i}`;
            if (childNode) {
                childNode.onclick = () => {
                    addToQueue(track, platform);
                }
            }

            if (parent) {
                parent.appendChild(childNode);
            }

            const child = createRoot(document.getElementById(`${platform}SearchResult${i}`) as Container);
            child.render(result);
        }
    }

    // Gets tracks via respective APIs and calls render function
    async function searchSelected(selected: string[]) {
        const isDeveloping = document.getElementById("developing")?.className === "On" ? true : false;
        const searchResultsLimit = 3;
        
        if(selected.includes("Spotify")) {
            const tracks = await getTracksSpotify(inputValue.toString());
            //renderTracks("Spotify", tracks);
        }
        if(selected.includes("YouTube")) {
            const tracks = await getTracksYoutube(inputValue.toString(), searchResultsLimit, isDeveloping);
            renderTracks("YouTube", tracks);
        }
        if(selected.includes("Apple Music")) {
            const tracks = await getTracksAppleMusic(inputValue.toString());
            //renderTracks("Apple Music", tracks);
        }
        if(selected.includes("SoundCloud")) {
            const tracks = await getTracksSoundcloud(inputValue.toString(), searchResultsLimit);
            renderTracks("SoundCloud", tracks);
        }
    }

    // Searches for song using available platforms
    async function searchFunction() {
        // Clears previous search
        clearSearchResults();

        // Gets all selected platforms and performs searches
        const selected = getSelectedPlatforms();
        searchSelected(selected);
    };

    // Udpates inputValue as the user continues typing
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    
    // If user presses "Enter", triggers searchFunction
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsEnterPressed(true);
            searchFunction();
        }
    };

    return(
        <div>
            <div id="topSearch" style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between"}}>
                <div style={{fontSize: 50, color: "black"}}>Search</div>
                <div><SelectablePlatforms></SelectablePlatforms></div>
            </div>

            <div id="searchBar">
                <input type="search" value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} style={{width: "100%", height: 40, background: "gray", borderRadius: "20px", fontSize: "25px"}}></input>
            </div>
            {children}
        </div>
    );
}

interface SearchResultsProps{
    children?: React.ReactNode;
};
export function SearchResults({children}: SearchResultsProps) {
    return(
        <div id='searchResultsParent'>
            <div id='searchResultsParentSpotify'></div>
            <div id='searchResultsParentYouTube'></div>
            <div id='searchResultsParentApple Music'></div>
            <div id='searchResultsParentSoundCloud'></div>
            <h1>Search Results</h1>
                {children}
        </div>
    );
}