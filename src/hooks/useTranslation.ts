'use client';

import { store } from '@/store/store';
import { getTranslations, FULL_COUNTRY_LANG_MAP, HARDCODED_LANGS } from '@/utils/translate';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

/**
 * Shared translation hook - centralizes country detection → language → translation logic.
 * 
 * @param textsToTranslate - Optional list of texts that need translation.
 *   If provided, any texts missing from hardcoded translations will be fetched via Google Translate API.
 *   If omitted, only hardcoded translations are loaded (no API fallback).
 * 
 * Usage:
 *   const { t } = useTranslation(['Request Review', 'Submit']);
 *   return <h1>{t('Request Review')}</h1>;
 */
export function useTranslation(textsToTranslate?: string[]) {
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const { geoInfo } = store();

    useEffect(() => {
        if (!geoInfo) return;

        const cc = geoInfo.country_code.toUpperCase();
        const lang = FULL_COUNTRY_LANG_MAP[cc] || 'en';

        // Clear translations when switching to English
        if (lang === 'en') {
            setTranslations({});
            return;
        }

        (async () => {
            // Get hardcoded translations as base (if available for this language)
            const hardcoded = HARDCODED_LANGS.has(lang) ? (getTranslations(lang) || {}) : {};

            // If no specific texts needed, just load hardcoded translations
            if (!textsToTranslate || textsToTranslate.length === 0) {
                if (Object.keys(hardcoded).length > 0) {
                    setTranslations(hardcoded);
                }
                return;
            }

            // Find texts missing from hardcoded translations
            const missingTexts = textsToTranslate.filter(text => !hardcoded[text]);

            // If all texts exist in hardcoded, use directly
            if (missingTexts.length === 0) {
                setTranslations(hardcoded);
                return;
            }

            // Set hardcoded first for instant display
            if (Object.keys(hardcoded).length > 0) {
                setTranslations(hardcoded);
            }

            // Check localStorage cache - invalidate if country changed
            const CACHE_KEY = 'translation_cache';
            const COUNTRY_KEY = 'translation_country';
            const storedCountry = typeof window !== 'undefined' ? localStorage.getItem(COUNTRY_KEY) : null;
            let cache: Record<string, string> = {};

            if (storedCountry !== cc) {
                // Country changed - clear old translation cache
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(CACHE_KEY);
                    localStorage.setItem(COUNTRY_KEY, cc);
                }
            } else {
                const cached = typeof window !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null;
                cache = cached ? JSON.parse(cached) : {};
            }

            const allMissingCached = missingTexts.every(text => cache[`en:${lang}:${text}`]);
            if (allMissingCached) {
                const translatedMap: Record<string, string> = { ...hardcoded };
                missingTexts.forEach(text => {
                    translatedMap[text] = cache[`en:${lang}:${text}`];
                });
                setTranslations(translatedMap);
                return;
            }

            // Translate missing texts via Google Translate API
            const translatePromises = missingTexts.map(async (text) => {
                const cacheKey = `en:${lang}:${text}`;
                if (cache[cacheKey]) return { text, translated: cache[cacheKey] };
                try {
                    const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
                        params: { client: 'gtx', sl: 'en', tl: lang, dt: 't', q: text }
                    });
                    const translatedText = response.data[0]
                        ?.map((item: unknown[]) => item[0])
                        .filter(Boolean)
                        .join('') || text;
                    cache[cacheKey] = translatedText;
                    return { text, translated: translatedText };
                } catch {
                    return { text, translated: text };
                }
            });

            const results = await Promise.all(translatePromises);
            if (typeof window !== 'undefined') {
                localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            }

            // Merge hardcoded + API results
            const translatedMap: Record<string, string> = { ...hardcoded };
            results.forEach(({ text, translated }) => {
                translatedMap[text] = translated;
            });
            setTranslations(translatedMap);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geoInfo]);

    const t = useCallback((text: string): string => translations[text] || text, [translations]);

    return { t, translations };
}
