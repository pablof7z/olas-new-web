import type { NDKEvent, NDKImage } from '@nostr-dev-kit/ndk';
import { PostCard } from './PostCard';

export function Feed({ events, onClick }: { events: NDKImage[]; onClick: (event: NDKEvent) => void }) {
    return (
        <div className="flex flex-col gap-4">
            {events.map((event) => (
                <PostCard key={event.id} event={event} onClick={onClick} />
            ))}
        </div>
    );
}
