'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation'

export default function MyPage() {
    const router = useRouter()
    const [isOn, setIsOn] = useState(true);

    const developState = `${isOn ? "On" : "Off"}`;
    const handleDevelopClick = () => {
        setIsOn(!isOn);
    };

    return(
        <div>
            <button type="button" onClick={() => router.push('/linkPlatforms')}>Link Platforms</button>
            <button type="button" onClick={() => router.push('/room')}>Room</button> 
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button id="developing" className={developState} type="button" onClick={handleDevelopClick}>
                    Developing Mode: {developState}
                </button>
            </div>
        </div>
    )
}