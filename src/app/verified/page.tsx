'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifiedPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/Ads-Policy-review');
    }, [router]);

    return null;
}
