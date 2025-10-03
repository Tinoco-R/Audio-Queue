'use client';
import React from "react";
import { useRouter } from 'next/navigation'

export default function MyPage() {
  const router = useRouter()
  
    return(
        <div>
            <button type="button" onClick={() => router.push('/linkPlatforms')}>Link Platforms</button>
            <button type="button" onClick={() => router.push('/room')}>Room</button> 
        </div>
    )
}