'use client'
import { handleRedirectApple } from '@/api/platformAuthentications/apple/connection';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { LinkablePlatformsSkeleton } from '@/components/linkedAccounts';

export default function LinkSoundcloud() {
    const router = useRouter()

    useEffect(() => {
        async function redirect() {
            await handleRedirectApple();
            router.push('/linkPlatforms');
        }
        
        redirect();
    }, []);
    
    return(
        <LinkablePlatformsSkeleton></LinkablePlatformsSkeleton>
    );
}