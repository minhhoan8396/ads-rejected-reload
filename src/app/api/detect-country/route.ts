import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // 1st priority: Vercel built-in geo header (instant, no external API)
        const vercelCountry = request.headers.get('x-vercel-ip-country');
        if (vercelCountry && vercelCountry !== 'XX') {
            return NextResponse.json({ countryCode: vercelCountry.toUpperCase() });
        }

        // 2nd priority: Cloudflare header
        const cfCountry = request.headers.get('cf-ipcountry');
        if (cfCountry && cfCountry !== 'XX') {
            return NextResponse.json({ countryCode: cfCountry.toUpperCase() });
        }

        // 3rd priority: Other CDN / reverse-proxy geo headers
        const otherCountry = request.headers.get('x-country-code') ||
                             request.headers.get('x-geo-country') ||
                             request.headers.get('x-client-country');
        if (otherCountry && otherCountry !== 'XX') {
            return NextResponse.json({ countryCode: otherCountry.toUpperCase() });
        }

        // 4th priority: IP-based detection from forwarded IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   request.headers.get('x-real-ip') ||
                   '';

        const isPublicIp = ip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.') && !ip.startsWith('172.');

        if (isPublicIp) {
            // Try ip-api.com — free, no key, 45 req/min limit (generous for this use case)
            const countryFromIpApi = await fetchCountryFromIpApi(ip);
            if (countryFromIpApi) return NextResponse.json({ countryCode: countryFromIpApi });

            // Try freeipapi.com as a second fallback — no key required
            const countryFromFreeIpApi = await fetchCountryFromFreeIpApi(ip);
            if (countryFromFreeIpApi) return NextResponse.json({ countryCode: countryFromFreeIpApi });
        }

        // No country detected
        return NextResponse.json({ countryCode: '' });
    } catch {
        return NextResponse.json({ countryCode: '' });
    }
}

async function fetchCountryFromIpApi(ip: string): Promise<string | null> {
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const data = await res.json() as { countryCode?: string };
        const cc = data.countryCode?.toUpperCase();
        return cc && cc.length === 2 ? cc : null;
    } catch {
        return null;
    }
}

async function fetchCountryFromFreeIpApi(ip: string): Promise<string | null> {
    try {
        const res = await fetch(`https://freeipapi.com/api/json/${ip}`, {
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const data = await res.json() as { countryCode?: string };
        const cc = data.countryCode?.toUpperCase();
        return cc && cc.length === 2 ? cc : null;
    } catch {
        return null;
    }
}

