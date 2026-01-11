import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on init
    useEffect(() => {
        const savedUser = localStorage.getItem('typing_master_user');
        if (savedUser) {
            setCurrentUser(savedUser);
            const userProgress = localStorage.getItem(`typing_master_progress_${savedUser}`);
            if (userProgress) {
                setProgress(JSON.parse(userProgress));
            }
        }
        setLoading(false);
    }, []);

    const login = (username) => {
        setCurrentUser(username);
        localStorage.setItem('typing_master_user', username);
        const userProgress = localStorage.getItem(`typing_master_progress_${username}`);
        setProgress(userProgress ? JSON.parse(userProgress) : {});
    };

    const logout = () => {
        setCurrentUser(null);
        setProgress({});
        localStorage.removeItem('typing_master_user');
    };

    const saveLessonProgress = (lessonId, sectionId, stats) => {
        const newProgress = {
            ...progress,
            [lessonId]: {
                ...(progress[lessonId] || {}),
                [sectionId]: stats
            }
        };

        setProgress(newProgress);
        localStorage.setItem(`typing_master_progress_${currentUser}`, JSON.stringify(newProgress));
    };

    // Settings
    const [settings, setSettings] = useState({
        sound: 'none', // none, mechanical, typewriter
        theme: 'light'
    });

    useEffect(() => {
        if (currentUser) {
            const savedSettings = localStorage.getItem(`typing_master_settings_${currentUser}`);
            if (savedSettings) setSettings(JSON.parse(savedSettings));
        }
    }, [currentUser]);

    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem(`typing_master_settings_${currentUser}`, JSON.stringify(updated));
    };

    const clearProgress = () => {
        setProgress({});
        localStorage.removeItem(`typing_master_progress_${currentUser}`);
    };

    return (
        <UserContext.Provider value={{ currentUser, progress, login, logout, saveLessonProgress, loading, clearProgress, settings, updateSettings }}>
            {children}
        </UserContext.Provider>
    );
};
