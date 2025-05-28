'use client';

import { FollowPackCard } from '@/features/follow-packs/components/FollowPackCard';
import { TrendingHashtags } from '@/features/sidebar/components/TrendingHashtags';
import { NDKFollowPack, NDKKind, useSubscribe } from '@nostr-dev-kit/ndk-hooks';

interface FeedSidebarProps {
    hashtags: string[];
}

export function FeedSidebar({ hashtags }: FeedSidebarProps) {
    return (
        <aside className="flex flex-col gap-6">
            <div className="sticky top-0 px-4">
                <TrendingHashtags hashtags={hashtags} />
            </div>
        </aside>
    );
}
