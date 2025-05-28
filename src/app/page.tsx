'use client';

import { FeedSidebar } from '@/features/feed/components/FeedSidebar';
import { FollowPackCard } from '@/features/follow-packs/components/FollowPackCard';
import { ImagePostModal } from '@/features/nostr/components/ImagePostModal';
import { Feed } from '@/features/post/components/Feed';
import { PostGridItem } from '@/features/posts/components/PostGridItem';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {
    Hexpubkey,
    NDKEvent,
    NDKFilter,
    NDKFollowPack,
    NDKImage,
    NDKKind,
    NDKSubscriptionCacheUsage,
    useSubscribe,
} from '@nostr-dev-kit/ndk-hooks';
import { useMemo, useState } from 'react';

export default function Home() {
    const [authors, setAuthors] = useState<Hexpubkey[] | false>(false);
    const filters = useMemo(() => {
        const filter: NDKFilter = { kinds: [NDKKind.Image], limit: 50 };
        if (authors) filter.authors = authors;
        return [filter];
    }, [authors]);
    const { events } = useSubscribe<NDKImage>(
        filters,
        { wrap: true, cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY, groupable: false },
        [filters]
    );
    const [openPost, setOpenPost] = useState<NDKEvent | null>(null);

    const hashtags = useMemo(() => {
        const allTags = events
            .flatMap((e) => e.getMatchingTags('t').map((t) => t[1]))
            .filter((tag): tag is string => !!tag);
        const tagCounts = allTags.reduce<Record<string, number>>((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(tagCounts)
            .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
            .slice(0, 9)
            .map(([tag]) => tag);
    }, [events]);

    const itemData = events.map((event, index) => {
        let cols = 1;
        let rows = 1;
        if (index % 7 === 0) {
            cols = 2;
            rows = 2;
        } else if (index % 7 === 3 || index % 7 === 5) {
            cols = 2;
        } else if (index % 7 === 2 || index % 7 === 6) {
            rows = 2;
        }
        const imageUrl = event.imetas?.[0]?.url;
        return {
            img: imageUrl,
            event,
            rows,
            cols,
            id: event.id,
        };
    });

    function handleFollowPackClick(event: NDKFollowPack) {
        setAuthors(event.pubkeys);
    }

    return (
        <main className="w-full flex flex-col items-center">
            <FollowPacks onClick={handleFollowPackClick} />
            {/* <section className="flex flex-col image-grid-section w-full h-screen">
                <div className="h-[calc(100vh-500px)] !w-screen overflow-clip">
                    <ImageList
                        sx={{ height: 'auto', minHeight: 450 }}
                        variant="quilted"
                        cols={6}
                        rowHeight={200}
                        gap={4}
                    >
                        {itemData.map((item) => (
                            <ImageListItem key={item.id} cols={item.cols || 1} rows={item.rows || 1}>
                                <PostGridItem
                                    event={item.event}
                                    width={121 * (item.cols || 1)}
                                    height={121 * (item.rows || 1)}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    onClick={() => setOpenPost(item.event)}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>

                </div>
            </section> */}

            {openPost && <ImagePostModal isOpen={true} onClose={() => setOpenPost(null)} event={openPost} />}

            {/* New Feed Area */}
            <section className="feed-area mt-8 flex flex-col lg:flex-row w-full max-w-7xl">
                <div className="new-sidebar-column w-full lg:w-1/5"></div>
                <div className="feed-column w-full lg:w-1/2 border border-border">
                    <Feed events={events} onClick={(event) => setOpenPost(event)} />
                </div>
                <div className="new-sidebar-column w-full lg:w-1/4">
                    <FeedSidebar hashtags={hashtags} />
                </div>
            </section>
        </main>
    );
}

function FollowPacks({ onClick }: { onClick: (event: NDKFollowPack) => void }) {
    const { events } = useSubscribe<NDKFollowPack>([{ kinds: [NDKKind.FollowPack], limit: 10 }], { wrap: true });

    return (
        <div className="flex flex-row gap-4 overflow-x-auto w-full my-8">
            {events.map((event) => (
                <button key={event.id} className="w-[300px] flex-none" onClick={() => onClick(event)}>
                    <FollowPackCard event={event} />
                </button>
            ))}
        </div>
    );
}
