'use client'
import { handleRedirectSpotify } from '@/api/platformAuthentications/spotify/connection';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function LinkSoundcloud() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        handleRedirectSpotify();
        router.push('/linkPlatforms');
    });

    return null;
}