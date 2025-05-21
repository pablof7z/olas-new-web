'use client';

// Removed Card imports as they are no longer used
import { Badge } from '@/components/ui/badge';
// import { Button } from "@/components/ui/button"; // "See all" removed for minimalism
import { Hash } from 'lucide-react';
import Link from 'next/link';

export function TrendingHashtags({ hashtags }: { hashtags: string[] }) {
    if (hashtags.length === 0) {
        return null;
    }

    return (
        <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Hash className="mr-2 h-5 w-5 text-gray-600" /> {/* Icon color adjusted */}
                Trending Hashtags
            </h3>
            <div className="space-y-2">
                {hashtags.map((hashtag, index) => (
                    <Link href={`/?q=#${hashtag}`} key={hashtag} passHref className="block w-full">
                        <span
                            variant={index === 0 ? 'default' : 'secondary'}
                            className={`
                w-full cursor-pointer transition-all duration-150 ease-in-out
                text-sm px-3 py-1.5 rounded-md
                hover:translate-x-1
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
                flex items-center
                ${index === 0 ? '' : ''}
              `}
                        >
                            <span className="truncate text-white/80">#{hashtag}</span>
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
