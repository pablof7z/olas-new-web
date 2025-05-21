/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { Sidebar } from '@/features/sidebar/components/Sidebar';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { NDKImage, NDKKind, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { useMemo } from 'react';

export default function Home() {
    const { events } = useSubscribe<NDKImage>([{ kinds: [NDKKind.Image], limit: 50 }], { wrap: true }); // Added limit for better display

    const hashtags = useMemo(() => {
        const allTags = events.flatMap((e) => e.getMatchingTags('t').map((t) => t[1]));
        // sorted by count
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(tagCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 9)
            .map(([tag]) => tag);
    }, [events]);

    const itemData = events.map((event, index) => {
        let cols = 1;
        let rows = 1;

        // Apply a pattern for quilted effect
        // This pattern is illustrative; adjust as needed for desired layout
        if (index % 7 === 0) {
            // Larger item
            cols = 2;
            rows = 2;
        } else if (index % 7 === 3 || index % 7 === 5) {
            // Wider item
            cols = 2;
        } else if (index % 7 === 2 || index % 7 === 6) {
            // Taller item
            rows = 2;
        }
        // Ensure image URL is valid, provide a fallback or filter out invalid events if necessary
        const imageUrl = event.imetas?.[0]?.url;

        return {
            img: imageUrl,
            event,
            rows,
            cols,
            id: event.id, // Keep original event id as key if needed
        };
    });

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full">
            <main className="flex-grow">
                {events.length > 0 ? (
                    <ImageList
                        sx={{ height: 'auto', minHeight: 450 }}
                        variant="quilted"
                        cols={6} // Reduced columns to make room for sidebar
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
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-muted-foreground">No images found or still loading...</p>
                    </div>
                )}
            </main>
            <div className="w-[300px] flex-shrink-0 md:sticky md:top-20 h-fit">
                <Sidebar hashtags={hashtags} />
            </div>
        </div>
    );
}
