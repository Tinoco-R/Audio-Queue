'use client';
import React from "react";
import LinkablePlatforms from "../components/linkedAccounts";
import Room from "@/components/room";

export default function MyPage() {
    return(
        <div>
            
            <h1 style={{display:"flex", justifyContent: "center", fontSize: "100px", fontFamily: "serif"}}>Linkable Platforms</h1>
            <LinkablePlatforms></LinkablePlatforms>

            <h1 style={{display: "flex", justifyContent: "center", fontSize: 100}}>Room</h1>
            <Room></Room>
        </div>
    )
}