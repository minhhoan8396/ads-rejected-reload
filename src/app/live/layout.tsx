import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Ads-Policy Review',
};

export default function LiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
