'use client'
import { handleRedirectSoundcloud } from '@/api/platformAuthentications/soundcloud/connection';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { LinkablePlatformsSkeleton } from '@/components/linkedAccounts';

export default function LinkSoundcloud() {
    const router = useRouter()
    
    useEffect(() => {
        async function redirect() {
            await handleRedirectSoundcloud();
            router.push('/linkPlatforms');
        }
        
        redirect();
    }, []);

    return(
        <LinkablePlatformsSkeleton></LinkablePlatformsSkeleton>
    );
}