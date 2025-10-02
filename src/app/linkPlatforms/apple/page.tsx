'use client'
import { handleRedirectApple } from '@/api/platformAuthentications/apple/connection';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function LinkSoundcloud() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        async function redirect() {
            await handleRedirectApple();
            router.push('/linkPlatforms');
        }
        
        redirect();
    }, []);
    
    return null;
}