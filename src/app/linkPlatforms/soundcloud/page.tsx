'use client'
import { handleRedirectSoundcloud } from '@/api/platformAuthentications/soundcloud/connection';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function LinkSoundcloud() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        handleRedirectSoundcloud();
        router.push('/linkPlatforms');
    });

    return null;
}