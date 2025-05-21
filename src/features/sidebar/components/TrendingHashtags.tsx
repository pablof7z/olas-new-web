'use client';

import { Hash } from 'lucide-react';
import Link from 'next/link';

export function TrendingHashtags({ hashtags }: { hashtags: string[] }) {
    if (hashtags.length === 0) {
        return null;
    }

    return (
        <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Hash className="mr-2 h-5 w-5" /> {/* Icon color adjusted */}
                hashtags
            </h3>
            <div className="space-y-2">
                {hashtags.map((hashtag, index) => (
                    <Link href={`/?q=#${hashtag}`} key={hashtag} passHref className="block w-full">
                        <span className="truncate text-sm font-light">#{hashtag}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
