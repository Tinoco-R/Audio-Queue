'use client';
import React, { useState } from 'react';
import { SelectablePlatforms } from "./linkedAccounts";

interface SearchTopProps{
    children?: React.ReactNode;
};

export default function SearchTop({children}: SearchTopProps) {
    const [inputValue, setInputValue] = useState('');
    const [isEnterPressed, setIsEnterPressed] = useState(false);

    // Finds and returns selected platforms via class name
    function getSelectedPlatforms() {
        let selected: string[] = [];
        const platforms = Array.from(document.querySelectorAll('[class*="Active"]')).map(el => el.className);

        platforms.forEach(platform => {
            const platformName = platform.replace(/Active$/, '').trim();
            selected.push(platformName);
        });

        return selected;
    }

    // Searches for song using available platforms
    const searchFunction = () => {
        // Gets all selected platforms
        const selected = getSelectedPlatforms();
        console.log("Selected:", selected);

        // Begins looking for the song until found on any linked platform
        
        // Needs: Artist, Title, Album Name, Image, Song File

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