'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { NDKEvent, NDKImage } from '@nostr-dev-kit/ndk';
import { useCallback, useState } from 'react';
import { EventCardHeader } from './CardHeader';
import { ImagePostModal } from './ImagePostModal';

interface ImageEventCardProps {
    event: NDKImage;
}

export function ImageEventCard({ event }: ImageEventCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<NDKEvent | null>(null);

    // Hooks must be called at the top level, before any conditional returns
    const handleImageClick = useCallback(() => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    }, [event]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    }, []);

    if (!event.author) return null;

    const imageUrlSource = event.imetas?.[0]?.[0];

    // Ensure imageUrlSource is a string before using it
    if (typeof imageUrlSource !== 'string') {
        return null; // Don't render if there's no valid image URL
    }
    const imageUrl: string = imageUrlSource;

    return (
        <>
            <Card className="overflow-hidden">
                <EventCardHeader event={event} className="p-4" />
                <CardContent className="p-0 cursor-pointer" onClick={handleImageClick}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={event.content || 'Nostr Image'}
                        className="aspect-square w-full object-cover"
                    />
                </CardContent>
                {event.content && (
                    <CardFooter className="p-4">
                        <p className="text-sm">{event.content}</p>
                    </CardFooter>
                )}
            </Card>

            {selectedEvent && <ImagePostModal isOpen={isModalOpen} onClose={handleCloseModal} event={selectedEvent} />}
        </>
    );
}
