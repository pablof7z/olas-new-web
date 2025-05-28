import type { NDKFollowPack, NDKUser } from '@nostr-dev-kit/ndk';
import { useNDK, useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FollowPackCardProps {
    event: NDKFollowPack;
    compact?: boolean;
}

export function FollowPackCard({ event, compact = false }: FollowPackCardProps) {
    const { ndk } = useNDK();
    const [users, setUsers] = useState<NDKUser[]>([]);
    const authorProfile = useProfileValue(event.pubkey);
    const [userProfiles, setUserProfiles] = useState<any[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            if (!ndk) return;

            try {
                const pubkeys = event.pubkeys;
                const userObjects = pubkeys.map((pubkey) => ndk.getUser({ pubkey }));
                setUsers(userObjects);
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        loadUsers();
    }, [ndk, event]);

    useEffect(() => {
        const loadUserProfiles = async () => {
            if (!ndk || users.length === 0) return;

            try {
                const profiles = await Promise.all(
                    users.map((user) => {
                        return new Promise(async (resolve) => {
                            const profile = await user.fetchProfile();
                            resolve(profile);
                        });
                    })
                );
                setUserProfiles(profiles);
            } catch (error) {
                console.error('Error loading user profiles:', error);
            }
        };

        loadUserProfiles();
    }, [users, ndk]);

    const title = event.title || 'Untitled Follow Pack';
    const imageUrl = event.image || '/foggy-mountain-landscape.png';
    const description = event.description || 'A curated collection of interesting profiles to follow on Nostr.';
    const updatedAt = new Date(event.created_at * 1000);
    const userCount = users.length;

    if (compact) {
        return (
            <div className="w-full max-w-[180px] rounded-2xl overflow-hidden shadow-lg relative h-[240px] group">
                {/* Heavily blurred background image (blurhash effect) */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                        src={imageUrl || '/placeholder.svg'}
                        alt=""
                        className="w-full h-full object-cover blur-3xl scale-110 opacity-90"
                    />
                </div>

                {/* Semi-transparent overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/40 z-10"></div>

                {/* Main clear image */}
                <div className="absolute inset-0 w-full h-full z-20">
                    <img
                        src={imageUrl || '/placeholder.svg'}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 z-30 flex flex-col justify-end text-white">
                    {/* Semi-transparent panel behind text for readability */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                    <h3 className="relative z-10 text-base font-bold mb-1 text-shadow-sm truncate whitespace-nowrap">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="relative z-10 text-xs text-gray-200 mb-2 truncate text-shadow-sm">
                        {description || 'No description'}
                    </p>

                    {/* User Count */}
                    <div className="relative z-10 flex justify-between items-center mb-2">
                        <div className="flex items-center bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full">
                            <Users className="w-3 h-3 mr-1" />
                            <span className="text-xs">{userCount}</span>
                        </div>
                    </div>

                    {/* Follow Button */}
                    <button className="relative z-10 w-full py-1.5 bg-white text-black hover:bg-gray-100 rounded-full text-xs font-bold transition-colors duration-300 flex items-center justify-center">
                        Follow
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-lg relative h-[320px] group">
            {/* Heavily blurred background image (blurhash effect) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                    src={imageUrl || '/placeholder.svg'}
                    alt=""
                    className="w-full h-full object-cover blur-3xl scale-110 opacity-90"
                />
            </div>

            {/* Semi-transparent overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/40 z-10"></div>

            {/* Main clear image */}
            <div className="absolute inset-0 w-full h-full z-20">
                <img
                    src={imageUrl || '/placeholder.svg'}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-30 flex flex-col justify-end text-white px-3 items-start text-left">
                {/* Semi-transparent panel behind text for readability */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                {/* Title */}
                <h2 className="relative z-10 text-xl font-bold text-shadow-sm whitespace-nowrap truncate">{title}</h2>

                {/* Description */}
                <p className="relative z-10 text-gray-200 line-clamp-3 text-shadow-sm text-sm">{description}</p>

                {/* User Count */}
                <div className="relative z-10 flex items-center my-2">
                    <div className="flex items-center bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{userCount} Users</span>
                    </div>
                </div>

                {/* Follow Button */}
                {/* <button className="relative z-10 w-full py-3 bg-white text-black hover:bg-gray-100 rounded-full font-bold transition-colors duration-300 flex items-center justify-center">
          Follow All
        </button> */}
            </div>

            {/* Author Badge */}
            <div className="absolute top-4 left-3 z-40 flex items-center bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                    <img
                        src={authorProfile?.image || '/placeholder.svg?height=24&width=24&query=avatar'}
                        alt={authorProfile?.displayName || 'Author'}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-sm text-white">{authorProfile?.displayName || event.pubkey.slice(0, 8)}</span>
            </div>
        </div>
    );
}
