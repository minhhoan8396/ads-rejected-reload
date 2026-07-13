import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Ads-Policy Review',
};

export default function VerifiedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
