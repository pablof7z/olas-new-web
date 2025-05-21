'use client';

import { Button } from '@/components/ui/button';
import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
import { useNDKSessionLogin } from '@nostr-dev-kit/ndk-hooks';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface BrowserExtensionLoginProps {
    onClose: () => void;
}

export default function BrowserExtensionLogin({ onClose }: BrowserExtensionLoginProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const login = useNDKSessionLogin();

    const handleNip07Login = async () => {
        try {
            setStatus('loading');
            const signer = new NDKNip07Signer();
            await signer.blockUntilReady();
            await login(signer);
            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to extension');
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 py-4">
            <div className="text-center mb-4">
                <p className="text-muted-foreground">Connect with a Nostr browser extension like Alby or nos2x</p>
            </div>

            {status === 'error' && (
                <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-md w-full">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">{errorMessage}</span>
                </div>
            )}

            {status === 'success' && (
                <div className="flex items-center text-green-500 bg-green-50 p-3 rounded-md w-full">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span className="text-sm">Successfully connected!</span>
                </div>
            )}

            <Button
                onClick={handleNip07Login}
                disabled={status === 'loading' || status === 'success'}
                className="w-full"
            >
                {status === 'loading' ? 'Connecting...' : 'Connect Extension'}
            </Button>
        </div>
    );
}
