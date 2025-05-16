'use client';

import { UserAvatar } from '@/features/nostr/components/UserAvatar';
import { cn } from '@/lib/utils';
import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import React from 'react';

interface ProfileHeroProps {
    profile: NDKUserProfile | undefined;
    pubkey: string; // For UserAvatar
    npub: string; // For display name fallback
    containerClassName?: string; // Optional class name for the container
}

export function ProfileHero({ profile, pubkey, npub, containerClassName }: ProfileHeroProps) {
    const displayName = profile?.name || profile?.displayName || npub.substring(0, 12) + '...';
    const bannerUrl = profile?.banner;

    return (
        <div className="w-full flex flex-col items-center">
            <div
                className="h-48 md:h-64 w-full bg-gray-300 dark:bg-gray-700 bg-cover bg-center"
                style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}
            >
                {!bannerUrl && (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-gray-500 dark:text-gray-400">No banner</span>
                    </div>
                )}
            </div>

            {/* Content Section (Avatar and Name) - This section is constrained by containerClassName */}
            <div className={cn('w-full flex flex-col gap-4 items-start !-mt-18', containerClassName)}>
                {' '}
                {/* pt for avatar: h-24/2=3rem (pt-12), h-32/2=4rem (pt-16) */}
                <div className="flex flex-row items-end gap-4">
                    <UserAvatar
                        pubkey={pubkey}
                        className="h-24 w-24 md:h-32 md:w-32 border-4 border-background rounded-full bg-background overflow-hidden"
                    />

                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                        {profile?.nip05 && <p className="text-xs text-muted-foreground mt-1">{profile.nip05}</p>}
                    </div>
                </div>
                {profile?.about && <p className="text-sm text-muted-foreground mt-2">{profile.about}</p>}
            </div>
        </div>
    );
}
