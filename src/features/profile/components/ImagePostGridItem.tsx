'use client';

import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { useCallback, useState } from 'react';
import { ImagePostModal } from '../../nostr/components/ImagePostModal';

interface ImagePostGridItemProps {
    imageUrl: string;
    event?: NDKEvent; // Actively used for modal display
}

export function ImagePostGridItem({ imageUrl, event }: ImagePostGridItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<NDKEvent | null>(null);

    const handleOpenModal = useCallback(() => {
        if (event) {
            setSelectedEvent(event);
            setIsModalOpen(true);
        }
    }, [event]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    }, []);

    if (!imageUrl) {
        return null;
    }

    return (
        <>
            <div
                className="aspect-square cursor-pointer overflow-hidden"
                onClick={handleOpenModal}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleOpenModal();
                    }
                }}
            >
                <img
                    src={imageUrl}
                    alt={event?.content ? event.content.substring(0, 50) + '...' : 'Image post'}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-200 ease-in-out hover:scale-105"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            {isModalOpen && selectedEvent && (
                <ImagePostModal isOpen={isModalOpen} onClose={handleCloseModal} event={selectedEvent} />
            )}
        </>
    );
}
