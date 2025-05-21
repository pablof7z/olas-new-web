'use client';

// Required for useRef
import { SiteHeader } from '@/features/navigation/components/SiteHeader';
import { NDKHeadless, NDKSessionLocalStorage, useNDK } from '@nostr-dev-kit/ndk-hooks';
import { Inter } from 'next/font/google';
import { useEffect, useRef } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadata has been removed from here as 'layout.tsx' is now a client component.
// It should be defined in a server component, like 'page.tsx'.

const explicitRelayUrls = ['wss://relay.primal.net', 'wss://purplepag.es', 'wss://relay.nostr.band'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const sessionStorage = useRef(new NDKSessionLocalStorage());

    const { ndk } = useNDK();
    useEffect(() => {
        ndk?.connect();
    }, [ndk]);

    return (
        <html lang="en">
            <body className={inter.className}>
                <NDKHeadless
                    ndk={{
                        explicitRelayUrls,
                    }}
                    session={{
                        storage: sessionStorage.current,
                        opts: { follows: true, profile: true },
                    }}
                />
                <SiteHeader />
                {children}
            </body>
        </html>
    );
}
