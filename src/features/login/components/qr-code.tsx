'use client';

import QRCodeLib from 'qrcode';
import { useEffect, useRef } from 'react';

interface QRCodeProps {
    value: string;
    size?: number;
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCodeLib.toCanvas(
                canvasRef.current,
                value,
                {
                    width: size,
                    margin: 2,
                    color: {
                        dark: '#000',
                        light: '#fff',
                    },
                },
                (error) => {
                    if (error) console.error('Error generating QR code:', error);
                }
            );
        }
    }, [value, size]);

    return (
        <div className="bg-white p-2 rounded-lg shadow-sm">
            <canvas ref={canvasRef} width={size} height={size} />
        </div>
    );
}
