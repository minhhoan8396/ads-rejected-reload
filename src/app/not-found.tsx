import type { FC } from 'react';
import Link from 'next/link';

const NotFound: FC = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
            <div className="text-center">
                <h1 className="mb-4 text-9xl font-bold text-white">404</h1>
                <p className="mb-8 text-2xl font-semibold text-gray-300">Trang không tìm thấy</p>
                <p className="mb-8 max-w-md text-gray-400">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link
                    href="/"
                    className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
