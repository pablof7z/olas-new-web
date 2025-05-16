'use client';

import { ImagePostGridItem } from '@/features/profile/components/ImagePostGridItem';
import { NDKEvent, NDKImage, NDKKind } from '@nostr-dev-kit/ndk';
import { useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { useMemo } from 'react';
import { useUserProfile } from './layout';

function extractMediaUrlsFromText(text: string): string[] {
    // image urls (end in .jpg, .png, etc.)
    const regex = /https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|webp)/i;
    const matches = text.match(regex);
    return matches ? matches : [];
}

export default function ProfilePostsPage() {
    const { user } = useUserProfile(); // Consume user from context

    const { events } = useSubscribe(
        user?.pubkey
            ? [
                  { kinds: [NDKKind.Image], authors: [user.pubkey] },
                  { kinds: [NDKKind.Text], authors: [user.pubkey] },
              ]
            : false,
        {
            wrap: true,
        }
    );

    const items = useMemo(() => {
        const res: { event: NDKEvent; url: string }[] = events
            .map((event) => {
                if (event instanceof NDKImage) {
                    return { event, url: event.imetas?.[0]?.url };
                } else if (event instanceof NDKEvent) {
                    const urls = extractMediaUrlsFromText(event.content);
                    if (urls.length > 0) return { event, url: urls[0] };
                    else return null;
                }
            })
            .filter((res) => res && res.event && res?.url);

        return res;
    }, [events]);

    if (!user) {
        // User is null if not resolved in layout or if npubFromParams was invalid
        return <div>User not found or profile is loading...</div>;
    }

    return (
        <div className="p-4">
            {events.length === 0 && <p>No image posts found for this user.</p>}
            <div className="grid grid-cols-1 gap-[1px] sm:grid-cols-2 md:grid-cols-3">
                {items.map(({ event, url }) => (
                    <ImagePostGridItem key={event.id} imageUrl={url} event={event} />
                ))}
            </div>
        </div>
    );
}
