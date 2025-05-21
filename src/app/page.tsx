/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { FeedSidebar } from '@/features/feed/components/FeedSidebar';
import { Feed } from '@/features/post/components/Feed';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { NDKImage, NDKKind, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { useMemo } from 'react';

export default function Home() {
    const { events } = useSubscribe<NDKImage>([{ kinds: [NDKKind.Image], limit: 50 }], { wrap: true });

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

    return (
        <main className="w-full flex flex-col items-center">
            {/* Image Grid Section */}
            <section className="image-grid-section w-full">
                <div className="h-[20vh] overflow-clip">
                    <ImageList
                        sx={{ height: 'auto', minHeight: 450 }}
                        variant="quilted"
                        cols={6}
                        rowHeight={200}
                        gap={4}
                    >
                        {itemData.map((item) => (
                            <ImageListItem key={item.id} cols={item.cols || 1} rows={item.rows || 1}>
                                {item.img && (
                                    <a href={`/p/${item.event.author.npub}`}>
                                        <img
                                            src={item.img}
                                            width={121 * (item.cols || 1)}
                                            height={121 * (item.rows || 1)}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            loading="lazy"
                                            className="object-cover w-full h-full"
                                        />
                                    </a>
                                )}
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            </section>

            {/* New Feed Area */}
            <section className="feed-area mt-8 flex flex-col lg:flex-row w-full max-w-7xl">
                <div className="new-sidebar-column w-full lg:w-1/5"></div>
                <div className="feed-column w-full lg:w-1/2 border border-r-0 border-border">
                    <Feed />
                </div>
                <div className="new-sidebar-column w-full lg:w-1/4 border border-border">
                    <FeedSidebar hashtags={hashtags} />
                </div>
            </section>
        </main>
    );
}
