/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { NDKImage, NDKKind, useSubscribe } from '@nostr-dev-kit/ndk-hooks';

export default function Home() {
    const { events } = useSubscribe<NDKImage>([{ kinds: [NDKKind.Image] }], { wrap: true }); // Added limit for better display

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
        <main style={{ display: 'flex', justifyContent: 'center' }}>
            {events.length > 0 ? (
                <ImageList
                    sx={{ height: 'auto', minHeight: 450 }} // Adjusted width/height
                    variant="quilted"
                    className="w-full"
                    cols={6} // Number of columns in the grid
                    rowHeight={200} // Base height of a row
                    gap={4} // Gap between items
                >
                    {itemData.map((item) => (
                        <ImageListItem key={item.id} cols={item.cols || 1} rows={item.rows || 1}>
                            {item.img && (
                                <a href={`/p/${item.event.author.npub}`}>
                                    <img
                                        src={item.img}
                                        width={121 * (item.cols || 1)} // Calculate width based on cols
                                        height={121 * (item.rows || 1)} // Calculate height based on rows
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
                                        loading="lazy"
                                        className="object-cover w-full h-full" // Ensure image covers the list item
                                    />
                                </a>
                            )}
                        </ImageListItem>
                    ))}
                </ImageList>
            ) : (
                <p>No images found or still loading...</p> // Display message if no events
            )}
        </main>
    );
}
