'use client';

import { useState } from 'react';
import { toggleStoreStatus } from '@/app/admin/actions';

interface StoreStatusToggleProps {
    initialIsOpen: boolean;
}

export default function StoreStatusToggle({ initialIsOpen }: StoreStatusToggleProps) {
    const [isOpen, setIsOpen] = useState(initialIsOpen);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        const newState = !isOpen;
        try {
            await toggleStoreStatus(newState);
            setIsOpen(newState);
        } catch (error) {
            console.error('Failed to toggle store status', error);
            alert('Failed to update store status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow mb-6">
            <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">Store Status</h3>
                <p className="text-sm text-gray-500">
                    {isOpen ? 'The store is currently OPEN.' : 'The store is currently CLOSED (Coming Soon).'}
                </p>
            </div>
            <div>
                <button
                    onClick={handleToggle}
                    disabled={loading}
                    className={`
            relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            ${isOpen ? 'bg-green-600' : 'bg-gray-200'}
          `}
                    role="switch"
                    aria-checked={isOpen}
                >
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200
              ${isOpen ? 'translate-x-5' : 'translate-x-0'}
            `}
                    />
                </button>
            </div>
        </div>
    );
}
