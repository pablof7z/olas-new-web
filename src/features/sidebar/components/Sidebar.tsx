'use client';

import { Hexpubkey } from '@nostr-dev-kit/ndk';
import { TrendingHashtags } from './TrendingHashtags';
import { TrendingUsers } from './TrendingUsers';

export function Sidebar({ hashtags, users }: { hashtags: string[]; users: Hexpubkey[] }) {
    return (
        <aside className="hidden md:block fixed top-0 h-screen w-[300px] space-y-8 py-8 px-6 overflow-y-auto">
            {/*
        - Fixed width between 280px to 320px (using 300px).
        - Vertical padding (at least 24px).
        - Group similar elements logically: "Trending Hashtags" first, then "Trending Users".
        - Generous vertical spacing (16-24px) between each group (using space-y-6 -> 24px).
        - Background color: white (#FFFFFF).
        - Sidebar remains fixed and visible on desktop and hidden on mobile.
        - Added overflow-y-auto in case content exceeds screen height.
      */}
            <TrendingHashtags hashtags={hashtags} />
            <TrendingUsers />
        </aside>
    );
}
