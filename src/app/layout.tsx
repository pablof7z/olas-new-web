'use client';

// Required for useRef
import { Sidebar } from '@/features/navigation/components/Sidebar';
import { cn } from '@/lib/utils';
import { NDKCacheAdapterSqliteWasm } from '@nostr-dev-kit/ndk-cache-sqlite-wasm';
import { NDKHeadless, NDKSessionLocalStorage, useNDK } from '@nostr-dev-kit/ndk-hooks';
import { Inter } from 'next/font/google';
import { cache, useEffect, useRef } from 'react';
import './globals.css';
import { shellExpandedAtom } from '@/features/app/stores/state';
import { ThemeProvider } from '@/features/navigation/components/ThemeProvider';
import { useAtomValue } from 'jotai';

const inter = Inter({ subsets: ['latin'] });

// Metadata has been removed from here as 'layout.tsx' is now a client component.
// It should be defined in a server component, like 'page.tsx'.

const explicitRelayUrls = ['wss://relay.primal.net', 'wss://purplepag.es', 'wss://relay.nostr.band'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const shellExpanded = useAtomValue(shellExpandedAtom);
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
                // ndk.cacheAdapter = cacheAdapterRef.current;
            });
        }
    }, [ndk]);

    return (
        <html lang="en">
            <body
                className={cn(
                    inter.className,
                    'transition-all duration-300',
                    shellExpanded ? 'mt-16 bg-[#f1f1f1]' : 'mt-0 bg-[#fdfdfd]'
                )}
            >
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
                    <main
                        className={cn(
                            'transition-all duration-300 overflow-clip bg-white',
                            shellExpanded ? 'rounded-t-3xl ml-48  shadow-lg' : 'mt-0 ml-16'
                        )}
                    >
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
