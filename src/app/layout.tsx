'use client';

// Required for useRef
import { Sidebar } from '@/features/navigation/components/Sidebar';
import { NDKCacheAdapterSqliteWasm } from '@nostr-dev-kit/ndk-cache-sqlite-wasm';
import { NDKHeadless, NDKSessionLocalStorage, useNDK } from '@nostr-dev-kit/ndk-hooks';
import { Inter } from 'next/font/google';
import { cache, useEffect, useRef } from 'react';
import './globals.css';
import { ThemeProvider } from '@/features/navigation/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

// Metadata has been removed from here as 'layout.tsx' is now a client component.
// It should be defined in a server component, like 'page.tsx'.

const explicitRelayUrls = ['wss://relay.primal.net', 'wss://purplepag.es', 'wss://relay.nostr.band'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const sessionStorage = useRef(new NDKSessionLocalStorage());
    const cacheAdapterRef = useRef(
        new NDKCacheAdapterSqliteWasm({
            workerUrl: '/sqlite-worker.js',
            wasmUrl: '/sqlite-wasm.wasm',
            dbName: 'olas',
        })
    );
    const { ndk } = useNDK();

    useEffect(() => {
        if (ndk) {
            cacheAdapterRef.current.initialize().then(() => {
                ndk.cacheAdapter = cacheAdapterRef.current;
            });
        }
    }, [ndk]);

    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider>
                    <NDKHeadless
                        ndk={{
                            explicitRelayUrls,
                        }}
                        session={{
                            storage: sessionStorage.current,
                            opts: { follows: true, profile: true },
                        }}
                    />
                    <Sidebar />
                    <main className="ml-16">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
