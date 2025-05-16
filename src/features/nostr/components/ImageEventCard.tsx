import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { NDKImage } from '@nostr-dev-kit/ndk';

interface ImageEventCardProps {
    event: NDKImage;
}

export function ImageEventCard({ event }: ImageEventCardProps) {
    if (!event.imetas || event.imetas.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    );
}
