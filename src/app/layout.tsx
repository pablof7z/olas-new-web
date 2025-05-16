'use client';

// Required for useRef
import { NDKHeadless, NDKSessionLocalStorage } from '@nostr-dev-kit/ndk-hooks';
import { Inter } from 'next/font/google';
import { useRef } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadata has been removed from here as 'layout.tsx' is now a client component.
// It should be defined in a server component, like 'page.tsx'.

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const sessionStorage = useRef(new NDKSessionLocalStorage());

    return (
        <html lang="en">
            <body className={inter.className}>
                <NDKHeadless
                    ndk={{
                        explicitRelayUrls: ['wss://relay.primal.net', 'wss://purplepag.es', 'wss://relay.nostr.band'],
                    }}
                    session={{
                        storage: sessionStorage.current,
                        opts: { follows: true, profile: true },
                    }}
                />
                {children}
            </body>
        </html>
    );
}
