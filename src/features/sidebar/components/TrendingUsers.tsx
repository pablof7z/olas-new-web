'use client';

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card related imports removed as they are no longer used
import { UserAvatar } from '@/features/nostr/components/UserAvatar';
import { cn } from '@/lib/utils';
import { NDKEvent, NDKKind, NDKUser } from '@nostr-dev-kit/ndk';
import { useProfileValue, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
// import { Button } from "@/components/ui/button"; // "See all" removed
import { Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface TrendingUserItemProps {
    user: NDKUser;
    // isMostTrending?: boolean; // Removed as per simplified design
}

function TrendingUserItem({ user }: TrendingUserItemProps) {
    const profile = useProfileValue(user.pubkey);
    const displayName = profile?.displayName || profile?.name || user.npub.substring(0, 12) + '...';

    return (
        <Link href={`/p/${user.npub}`} passHref>
            <div
                className={cn(
                    'flex items-center gap-3 p-3 rounded-md transition-all duration-150 ease-in-out cursor-pointer group',
                    'hover:bg-gray-100 hover:translate-x-1',
                    'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1',
                    'border border-gray-100'
                )}
            >
                <UserAvatar pubkey={user.pubkey} className="h-10 w-10" />
                <span className="text-sm font-medium truncate text-gray-700">{displayName}</span>
            </div>
        </Link>
    );
}

export function TrendingUsers() {
    const { events } = useSubscribe<NDKEvent>([
        {
            kinds: [NDKKind.Text, NDKKind.Image], // Consider what kinds indicate "active" users
            limit: 200, // Fetch more events to get a better pool of users
        },
    ]);

    const trendingUsers = useMemo(() => {
        const userActivity: Record<string, { user: NDKUser; count: number }> = {};

        events.forEach((event) => {
            if (event.author) {
                const pubkey = event.author.pubkey;
                if (!userActivity[pubkey]) {
                    userActivity[pubkey] = { user: event.author, count: 0 };
                }
                userActivity[pubkey].count++;
            }
        });

        return Object.values(userActivity)
            .sort((a, b) => b.count - a.count)
            .map((item) => item.user)
            .slice(0, 9); // Show top 9 trending users
    }, [events]);

    if (trendingUsers.length === 0) {
        return null;
    }

    return (
        // Removed Card component wrapper
        <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-600" /> {/* Icon color adjusted */}
                Trending Users
            </h3>
            <div className="space-y-3">
                {' '}
                {/* Increased spacing between user items */}
                {trendingUsers.map((user, index) => (
                    <div key={user.pubkey}>
                        <TrendingUserItem user={user} />
                        {index < trendingUsers.length - 1 && <hr className="border-gray-100 my-3" />}
                    </div>
                ))}
            </div>
            {/* "See all" button removed */}
        </section>
    );
}
