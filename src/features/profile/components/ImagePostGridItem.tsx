'use client';

import type { NDKEvent } from '@nostr-dev-kit/ndk';

interface ImagePostGridItemProps {
    imageUrl: string;
    event?: NDKEvent; // Optional: for future use, like linking to post details
}

export function ImagePostGridItem({ imageUrl }: ImagePostGridItemProps) {
    if (!imageUrl) {
        return null;
    }

    return (
        <div className="aspect-square overflow-hidden">
            <img
                src={imageUrl}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform duration-200 ease-in-out hover:scale-105"
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}
