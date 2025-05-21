'use client';

import { TrendingHashtags } from '@/features/sidebar/components/TrendingHashtags';

interface FeedSidebarProps {
    hashtags: string[];
}

export function FeedSidebar({ hashtags }: FeedSidebarProps) {
    return (
        <aside className="flex flex-col gap-6">
            <div className="rounded-xl h-screen sticky top-0 p-4">
                <TrendingHashtags hashtags={hashtags} />
            </div>
            {/* Future sidebar boxes can be added here, each wrapped in a similar styled div */}
        </aside>
    );
}
