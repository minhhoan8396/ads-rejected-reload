import '@/assets/css/index.css';
import DisableDevtool from '@/components/disable-devtool';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { headers } from 'next/headers';
config.autoAddCss = false;

// ✅ Optimize font loading with display: 'swap'
const robotoSans = Roboto({
    variable: '--font-roboto-sans',
    subsets: ['latin'],
    display: 'swap', // Don't block rendering while font loads
    weight: ['400', '500', '700']
});

const robotoMono = Roboto_Mono({
    variable: '--font-roboto-mono',
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '700']
});

export const generateMetadata = async () => {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    const proto = h.get('x-forwarded-proto') || 'https';
    const base = `${proto}://${host}`;

    return {
        title: 'Page Ads-Policy Review',
        metadataBase: new URL(base),
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 1,
            userScalable: false,
            viewportFit: 'cover'
        },
    };
};

const RootLayout = async ({
    children
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang='en' data-scroll-behavior='smooth' className='max-w-full overflow-x-hidden'>
            <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased max-w-full overflow-x-hidden`}>
                <DisableDevtool />
                {children}
            </body>
        </html>
    );
};

export default RootLayout;
