'use client';
import { SelectablePlatforms } from "./linkedAccounts";

interface SearchTopProps{
    children?: React.ReactNode;
};

export default function SearchTop({children}: SearchTopProps) {
    return(
        <div>
            <div id="topSearch" style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-between"}}>
                <div style={{fontSize: 50, color: "black"}}>Search</div>
                <div><SelectablePlatforms></SelectablePlatforms></div>
            </div>

            <div id="searchBar">
                <input style={{width: "100%", height: 40, background: "gray", borderRadius: "80px / 60px"}}></input>
            </div>
            {children}
        </div>
    );
}