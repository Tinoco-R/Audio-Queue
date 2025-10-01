'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import LinkablePlatforms from "@/components/linkedAccounts"

export default function LinkPlatforms() {
    const router = useRouter()

    useEffect(() => {
        router.refresh();
    });

    return(
        <div>            
            <LinkablePlatforms></LinkablePlatforms>
        </div>
    )
}