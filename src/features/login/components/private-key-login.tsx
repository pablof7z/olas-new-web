'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useNDKCurrentPubkey, useNDKSessionLogin, useNDKSessionSwitch } from '@nostr-dev-kit/ndk-hooks';
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface PrivateKeyLoginProps {
    onClose: () => void;
    onBack: () => void;
}

export default function PrivateKeyLogin({ onClose, onBack }: PrivateKeyLoginProps) {
    const [nsec, setNsec] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const login = useNDKSessionLogin();
    const currentPubkey = useNDKCurrentPubkey();

    const handlePrivateKeyLogin = async () => {
        try {
            setStatus('loading');
            const signer = new NDKPrivateKeySigner(nsec);

            // Login with the signer
            await login(signer);

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Invalid private key');
        }
    };

    return (
        <div className="flex flex-col space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="nsec">Private Key (nsec)</Label>
                <div className="relative">
                    <Input
                        id="nsec"
                        type={showPassword ? 'text' : 'password'}
                        value={nsec}
                        onChange={(e) => setNsec(e.target.value)}
                        placeholder="nsec1..."
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
            </div>

            {status === 'error' && (
                <div className="flex items-center text-red-500 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">{errorMessage}</span>
                </div>
            )}

            {status === 'success' && (
                <div className="flex items-center text-green-500 bg-green-50 p-3 rounded-md">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span className="text-sm">Successfully signed in!</span>
                </div>
            )}

            <div className="flex space-x-2 mt-2">
                <Button variant="outline" onClick={onBack} className="flex-1 h-10" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handlePrivateKeyLogin}
                    disabled={!nsec || status === 'loading' || status === 'success'}
                    className="flex-1 h-10"
                >
                    {status === 'loading' ? 'Signing in...' : 'Sign In'}
                </Button>
            </div>
        </div>
    );
}
