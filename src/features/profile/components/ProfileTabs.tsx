'use client';

import Link from 'next/link';
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface ProfileTabsProps {
    npub: string;
    currentPathname: string;
}

export function ProfileTabs({ npub, currentPathname }: ProfileTabsProps) {
    const postsPath = `/p/${npub}`;
    const updatesPath = `/p/${npub}/updates`;

    // Determine the active tab value based on the current pathname
    // Default to postsPath if the currentPathname doesn't exactly match updatesPath
    const activeTabValue = currentPathname === updatesPath ? updatesPath : postsPath;

    return (
        <div className="px-4 py-2 border-b">
            <Tabs value={activeTabValue} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={postsPath} asChild>
                        <Link href={postsPath}>Posts</Link>
                    </TabsTrigger>
                    <TabsTrigger value={updatesPath} asChild>
                        <Link href={updatesPath}>Updates</Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
