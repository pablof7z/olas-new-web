'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NDKNip46Signer } from '@nostr-dev-kit/ndk';
import { useNDK, useNDKCurrentPubkey, useNDKSessionLogin, useNDKSessionSwitch } from '@nostr-dev-kit/ndk-hooks';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import QRCode from './qr-code';

interface RemoteSignerLoginProps {
    onClose: () => void;
    onBack: () => void;
}

export default function RemoteSignerLogin({ onClose, onBack }: RemoteSignerLoginProps) {
    const [bunkerUri, setBunkerUri] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const login = useNDKSessionLogin();
    const switchSession = useNDKSessionSwitch();
    const currentPubkey = useNDKCurrentPubkey();
    const { ndk } = useNDK();
    const [nostrconnectUri, setNostrconnectUri] = useState('');

    useEffect(() => {
        if (ndk) {
            try {
                const signer = NDKNip46Signer.nostrconnect(ndk, 'wss://relay.primal.net');
                setNostrconnectUri(signer.nostrconnectUri);
                signer.blockUntilReady().then(() => {
                    login(signer);
                });
            } catch (error) {
                console.error('Error setting up NostrConnect:', error);
            }
        }
    }, [ndk, login]);

    const handleRemoteSignerLogin = async () => {
        try {
            setStatus('loading');

            if (!ndk) {
                throw new Error('NDK not initialized');
            }

            const signer = NDKNip46Signer.bunker(ndk, bunkerUri);
            await signer.blockUntilReady();

            // Login with the signer
            await login(signer);

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Invalid bunker URI');
        }
    };

    // Sample bunker URI for QR code
    const sampleBunkerUri =
        'bunker://npub1abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrst?relay=wss://relay.example.com';

    return (
        <div className="flex flex-col space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="bunkerUri">Bunker URI</Label>
                <Textarea
                    id="bunkerUri"
                    value={bunkerUri}
                    onChange={(e) => setBunkerUri(e.target.value)}
                    placeholder="bunker://..."
                    className="min-h-[80px]"
                />
            </div>

            <div className="flex justify-center py-2">
                <QRCode value={sampleBunkerUri} size={150} />
            </div>

            <p className="text-xs text-center text-muted-foreground">Scan this QR code with your Nostr Bunker app</p>

            {status === 'error' && (
                <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">{errorMessage}</span>
                </div>
            )}

            {status === 'success' && (
                <div className="flex items-center text-green-500 bg-green-50 p-3 rounded-md">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span className="text-sm">Successfully connected!</span>
                </div>
            )}

            <div className="flex space-x-2 mt-2">
                <Button variant="outline" onClick={onBack} className="flex-1 h-10" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handleRemoteSignerLogin}
                    disabled={!bunkerUri || status === 'loading' || status === 'success'}
                    className="flex-1 h-10"
                >
                    {status === 'loading' ? 'Connecting...' : 'Connect'}
                </Button>
            </div>
        </div>
    );
}
