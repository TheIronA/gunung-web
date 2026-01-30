'use client';

import { useState } from 'react';
import { toggleProductStatus } from '@/app/admin/actions';

interface ProductVisibilityToggleProps {
    productId: string;
    initialIsActive: boolean;
}

export default function ProductVisibilityToggle({ productId, initialIsActive }: ProductVisibilityToggleProps) {
    const [isActive, setIsActive] = useState(initialIsActive);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        const newState = !isActive;
        try {
            await toggleProductStatus(productId, newState);
            setIsActive(newState);
        } catch (error) {
            console.error('Failed to toggle product status', error);
            alert('Failed to update product status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                {isActive ? 'Visible' : 'Hidden'}
            </span>
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`
          relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${isActive ? 'bg-indigo-600' : 'bg-gray-200'}
        `}
                role="switch"
                aria-checked={isActive}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
            ${isActive ? 'translate-x-4' : 'translate-x-0'}
          `}
                />
            </button>
        </div>
    );
}
