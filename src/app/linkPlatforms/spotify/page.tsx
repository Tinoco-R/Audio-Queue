'use client'
import { handleRedirectSpotify } from '@/api/platformAuthentications/spotify/connection';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { LinkablePlatformsSkeleton } from '@/components/linkedAccounts';

export default function LinkSoundcloud() {
    const router = useRouter()

    useEffect(() => {
        async function redirect() {
            await handleRedirectSpotify();
            router.push('/linkPlatforms');
        }
        
        redirect();
    }, [router]);

    return(
        <LinkablePlatformsSkeleton></LinkablePlatformsSkeleton>
    );
}