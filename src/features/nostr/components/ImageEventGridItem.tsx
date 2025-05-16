import { cn } from '@/lib/utils';
import { NDKImage } from '@nostr-dev-kit/ndk-hooks';

interface ImageEventGridItemProps {
    event: NDKImage;
    className?: string;
}

export function ImageEventGridItem({ event, className }: ImageEventGridItemProps) {
    if (!event.imetas || event.imetas.length === 0) return null;

    const url = event.imetas[0]?.url;

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Image" className={cn(['object-cover h-auto', className])} loading="lazy" decoding="async" />
    );
}
