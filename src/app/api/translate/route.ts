import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const countryToLanguage: Record<string, string> = {
    // Americas
    US: 'en', CA: 'en', MX: 'es', BR: 'pt', AR: 'es', CL: 'es',
    CO: 'es', PE: 'es', EC: 'es', VE: 'es', GY: 'en', SR: 'nl', BO: 'es', PY: 'es', UY: 'es',
    GT: 'es', HN: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
    DO: 'es', HT: 'fr', JM: 'en',
    // Europe
    AT: 'de', BE: 'nl', BG: 'bg', HR: 'hr', CY: 'el', CZ: 'cs',
    DK: 'da', EE: 'et', FI: 'fi', FR: 'fr', DE: 'de', GR: 'el', HU: 'hu', IE: 'ga',
    IT: 'it', LV: 'lv', LT: 'lt', LU: 'lb', MT: 'mt', NL: 'nl', PL: 'pl', PT: 'pt', RO: 'ro',
    GB: 'en', SE: 'sv', CH: 'fr', TR: 'tr',
    RS: 'sr', BA: 'bs', ME: 'sr', UA: 'uk', BY: 'be', MD: 'ro', IS: 'is', AL: 'sq',
    // Asia
    CN: 'zh', JP: 'ja', KR: 'ko', HK: 'zh', TW: 'zh', SG: 'en', MY: 'ms', TH: 'th',
    VN: 'vi', PH: 'tl', ID: 'id', BD: 'bn', IN: 'hi', PK: 'ur', LK: 'si', NP: 'ne',
    AF: 'ps', IR: 'fa', KZ: 'kk', UZ: 'uz', TJ: 'tg', KG: 'ky',
    MM: 'my', LA: 'lo', KH: 'km', RU: 'ru', AU: 'en', NZ: 'en',
    // Middle East & West Asia
    AE: 'ar', SA: 'ar', KW: 'ar', BH: 'ar', QA: 'ar', OM: 'ar', YE: 'ar',
    IL: 'iw', PS: 'ar', JO: 'ar', LB: 'ar', SY: 'ar', IQ: 'ar',
    // Africa
    EG: 'ar', ZA: 'af', NG: 'en', KE: 'sw', ET: 'am', GH: 'en', CM: 'fr', SN: 'fr',
    MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', MG: 'mg', ZW: 'en', BW: 'en'
};

async function translateSingle(text: string, targetLang: string): Promise<string> {
    if (targetLang === 'en') {
        return text;
    }

    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: targetLang,
                dt: 't',
                q: text
            },
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const data = response.data;
        const translatedText = data[0]
            ?.map((item: unknown[]) => item[0])
            .filter(Boolean)
            .join('');

        return translatedText || text;
    } catch {
        return text;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { texts, countryCode } = await req.json();

        if (!Array.isArray(texts) || !countryCode) {
            return NextResponse.json(
                { error: 'Missing texts array or countryCode' },
                { status: 400 }
            );
        }

        const targetLang = countryToLanguage[countryCode] || 'en';

        // Translate all texts in parallel
        const results = await Promise.all(
            texts.map(text => translateSingle(text, targetLang))
        );

        const translationMap: Record<string, string> = {};
        texts.forEach((text, index) => {
            translationMap[text] = results[index];
        });

        return NextResponse.json({ results: translationMap });
    } catch (error) {
        console.error('Translation API error:', error);
        return NextResponse.json(
            { error: 'Translation failed' },
            { status: 500 }
        );
    }
}

