import type { NDKEvent, NDKImage } from '@nostr-dev-kit/ndk';
import { NDKKind, useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import { PostCard } from './PostCard';

export function Feed() {
    const { events } = useSubscribe<NDKImage>([{ kinds: [NDKKind.Image], limit: 50 }], { wrap: true });

    return (
        <div className="flex flex-col gap-4">
            {events.map((event) => (
                <PostCard key={event.id} event={event} />
            ))}
        </div>
    );
}
