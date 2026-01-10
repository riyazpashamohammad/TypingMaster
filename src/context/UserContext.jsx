import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [progress, setProgress] = useState({});

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
        // stats: { wpm, accuracy, duration }
        const newProgress = { ...progress };

        if (!newProgress[lessonId]) {
            newProgress[lessonId] = {};
        }

        // Update section best
        const key = `${lessonId}_${sectionId}`;
        newProgress[key] = stats; // Simplification: just overwrite with latest or best

        setProgress(newProgress);
        localStorage.setItem(`typing_master_progress_${currentUser}`, JSON.stringify(newProgress));
    };

    return (
        <UserContext.Provider value={{ currentUser, progress, login, logout, saveLessonProgress }}>
            {children}
        </UserContext.Provider>
    );
};
