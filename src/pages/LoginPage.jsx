import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [name, setName] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (name.trim()) {
            login(name);
            navigate('/study');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-indigo-800">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transform transition-all hover:scale-105">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 text-white text-3xl font-bold shadow-lg">
                        T
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">TypingMaster</h1>
                    <p className="text-gray-500">Pro Edition</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">User Profile</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-3 text-white bg-blue-600 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg transition-colors flex items-center justify-center gap-2">
                        Enter Course
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    © 2026 Typing Master Pro Clone. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
