'use client';

import { ImagePostModal } from '@/features/nostr/components/ImagePostModal';
import { PostGridItem } from '@/features/posts/components/PostGridItem';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { NDKEvent, NDKImage, NDKKind, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { set } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const isHashtag = q.startsWith('#');
    const hashtag = isHashtag ? decodeURIComponent(q).slice(1) : null;

    const filter = useMemo(() => {
        if (isHashtag && hashtag) {
            return [{ kinds: [NDKKind.Image], '#t': [hashtag], limit: 50 }];
        }
        return false;
    }, [isHashtag, hashtag]);

    const { events } = useSubscribe<NDKImage>(filter, { wrap: true }, [hashtag]);

    const itemData = useMemo(() => {
        return events.map((event, index) => {
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
    }, [events]);

    const [openPost, setOpenPost] = useState<NDKEvent | null>(null);
    const handleImageClick = (event: NDKImage) => {
        setOpenPost(event);
    };

    const handleClose = () => {
        setOpenPost(null);
    };

    return (
        <main className="w-full flex flex-col items-center">
            <section className="image-grid-section w-full">
                <h1 className="text-2xl font-bold my-6 fixed top-0 left-20 z-50 bg-background/50 p-4 rounded-lg backdrop-blur-md">
                    {isHashtag && hashtag ? `#${hashtag}` : 'Search Nostr Images'}
                </h1>
                <div className="grid grid-cols-8 gap-1">
                    {itemData.map(({ event }) => (
                        <PostGridItem key={event.id} event={event} onClick={() => handleImageClick(event)} />
                    ))}
                </div>
            </section>
            {openPost && <ImagePostModal isOpen={true} onClose={() => setOpenPost(null)} event={openPost} />}
        </main>
    );
}
