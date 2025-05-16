'use client';

import { ProfileHero } from '@/features/profile/components/ProfileHero';
import { ProfileTabs } from '@/features/profile/components/ProfileTabs';
import { NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK, useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { useParams, usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ProfileLayoutProps {
    children: React.ReactNode;
}

interface UserProfileContextType {
    user: NDKUser | null;
    profile: ReturnType<typeof useProfileValue> | null;
    npubFromParams: string;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function useUserProfile() {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
}

// This internal provider will fetch and resolve the user
function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const { ndk } = useNDK();
    const params = useParams();
    const npubParam = params.npub as string; // This can be npub or NIP-05

    let user: NDKUser | null = null;
    if (npubParam && !npubParam?.includes('.')) {
        user = new NDKUser({ npub: npubParam });
    }

    const [resolvedUser, setResolvedUser] = useState<NDKUser | null>(user);

    useEffect(() => {
        if (!ndk) {
            setResolvedUser(null);
            return;
        }

        if (npubParam.includes('.')) {
            // Assume it's a NIP-05
            ndk.getUserFromNip05(npubParam)
                .then((userFromNip05) => {
                    if (userFromNip05) {
                        setResolvedUser(userFromNip05);
                    } else {
                        // NIP-05 resolution failed
                        setResolvedUser(null);
                    }
                })
                .catch(() => {
                    setResolvedUser(null);
                });
        } else {
            // Assume it's an npub
            const user = new NDKUser({ npub: npubParam });
            user.ndk = ndk; // Associate NDK instance
            setResolvedUser(user);
        }
    }, [ndk, npubParam]);

    const profileData = useProfileValue(resolvedUser?.pubkey);

    const value = {
        user: resolvedUser,
        profile: resolvedUser ? profileData : null,
        npubFromParams: typeof npubParam === 'string' ? npubParam : '',
    };

    return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

function ProfileLayoutContent({ children, currentPathname }: ProfileLayoutProps & { currentPathname: string }) {
    const { user, profile, npubFromParams } = useUserProfile();

    if (!user) {
        return <div></div>;
    }

    return (
        <div className="flex flex-col w-full items-center">
            <ProfileHero
                profile={profile ?? undefined}
                npub={user.npub}
                pubkey={user.pubkey}
                containerClassName="max-w-5xl mx-auto"
            />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full !mt-10">
                <ProfileTabs npub={npubFromParams} currentPathname={currentPathname} />
                <main className="container px-4 py-8">{children}</main>
            </div>
        </div>
    );
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    const currentPathname = usePathname();

    return (
        <UserProfileProvider>
            <ProfileLayoutContent currentPathname={currentPathname}>{children}</ProfileLayoutContent>
        </UserProfileProvider>
    );
}
