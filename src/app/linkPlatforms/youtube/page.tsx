'use client'
import { handleRedirectYoutube } from '@/api/platformAuthentications/youtube/connection';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { LinkablePlatformsSkeleton } from '@/components/linkedAccounts';

export default function LinkSoundcloud() {
    const router = useRouter()

    useEffect(() => {
        async function redirect() {
            await handleRedirectYoutube();
            router.push('/linkPlatforms');
        }
        
        redirect();
    }, []);

    return(
        <LinkablePlatformsSkeleton></LinkablePlatformsSkeleton>
    );
}