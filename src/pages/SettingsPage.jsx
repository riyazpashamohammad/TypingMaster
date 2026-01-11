import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useUser } from '../context/UserContext';
import { User, Trash2, Volume2, Monitor, AlertTriangle } from 'lucide-react';

const SettingsPage = () => {
    const { currentUser, progress, clearProgress, settings, updateSettings } = useUser();
    const [confirmClear, setConfirmClear] = useState(false);

    const handleClear = () => {
        clearProgress();
        setConfirmClear(false);
        // Maybe show toast?
    };

    return (
        <AppLayout>
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
                            <User size={20} /> Account
                        </h2>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Username</span>
                            <span className="font-mono font-bold text-gray-900 bg-white px-3 py-1 rounded border">
                                {currentUser}
                            </span>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
                            <Monitor size={20} /> Interface & Sound
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Sound Theme</h3>
                                    <p className="text-sm text-gray-500">Audio feedback while typing</p>
                                </div>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {[
                                        { id: 'none', label: 'Mute', icon: null },
                                        { id: 'mechanical', label: 'Mechanical', icon: Volume2 },
                                        { id: 'typewriter', label: 'Typewriter', icon: Volume2 },
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => updateSettings({ sound: opt.id })}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${settings?.sound === opt.id
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {opt.icon && <opt.icon size={14} />}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                            <AlertTriangle size={20} /> Danger Zone
                        </h2>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Clear All Progress</h3>
                                <p className="text-sm text-gray-500 max-w-md">
                                    Permanently remove all lesson history, high scores, and game data including {Object.keys(progress).length} lesson records.
                                    This action cannot be undone.
                                </p>
                            </div>

                            {!confirmClear ? (
                                <button
                                    onClick={() => setConfirmClear(true)}
                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Reset Progress
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-red-600">Are you sure?</span>
                                    <button
                                        onClick={handleClear}
                                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setConfirmClear(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default SettingsPage;
