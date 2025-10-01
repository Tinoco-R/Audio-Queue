'use client';
import React from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import LinkablePlatforms from "@/components/linkedAccounts"

export default function MyPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
    return(
        <div>
            <button type="button" onClick={() => router.push('/linkPlatforms')}>Link Platforms</button>
            <button type="button" onClick={() => router.push('/room')}>Room</button> 
        </div>
    )
}