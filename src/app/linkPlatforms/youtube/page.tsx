'use client'
import { handleRedirectYoutube } from '@/api/platformAuthentications/youtube/connection';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function LinkSoundcloud() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        handleRedirectYoutube();
        router.push('/linkPlatforms');
    });

    return null;
}