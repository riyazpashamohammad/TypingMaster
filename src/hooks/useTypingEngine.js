import { useState, useEffect, useCallback } from 'react';

export const useTypingEngine = (targetText) => {
    const [cursor, setCursor] = useState(0);
    const [typedChars, setTypedChars] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [errorCount, setErrorCount] = useState(0);

    const totalChars = targetText.length;
    const isFinished = cursor >= totalChars;

    const reset = useCallback(() => {
        setCursor(0);
        setTypedChars('');
        setStartTime(null);
        setEndTime(null);
        setErrorCount(0);
    }, []);

    const handleKeyPress = useCallback((key) => {
        if (isFinished) return;

        if (!startTime) {
            setStartTime(Date.now());
        }

        const expectedChar = targetText[cursor];

        if (key.length === 1) { // Standard printable character
            // Check correctness
            // We could implement backspace logic, but for drills usually it's just forward or blocking
            // For this drill, let's assume we advance only on correct or mark incorrect but advance?
            // TypingMaster usually blocks on incorrect or shows red.
            // Let's implement: Advance always, but mark red if wrong.
            // OR: Block until correct (Common in beginners).
            // Let's go with BLOCK until correct for "New Keys" and ADVANCE for "Drills" ??
            // Actually, simple model: Advance.

            setTypedChars(prev => prev + key);

            if (key !== expectedChar) {
                setErrorCount(prev => prev + 1);
            }

            setCursor(prev => prev + 1);

            if (cursor + 1 >= totalChars) {
                setEndTime(Date.now());
            }
        }
    }, [cursor, isFinished, startTime, targetText, totalChars]);

    // WPM Calculation
    const wpm = (() => {
        if (!startTime) return 0;
        const end = endTime || Date.now();
        const durationInMinutes = (end - startTime) / 60000;
        if (durationInMinutes === 0) return 0;
        const words = cursor / 5; // Standard 5 chars per word
        return Math.round(words / durationInMinutes);
    })();

    // Accuracy
    const accuracy = (() => {
        if (cursor === 0) return 100;
        const correct = cursor - errorCount;
        return Math.round((correct / cursor) * 100);
    })();

    return {
        cursor,
        typedChars,
        wpm,
        accuracy,
        isFinished,
        handleKeyPress,
        reset
    };
};
