import { useState, useEffect, useCallback } from 'react';

export const useTypingEngine = (targetText, isInfinite = false) => {
    const [cursor, setCursor] = useState(0);
    const [typedChars, setTypedChars] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [errorCount, setErrorCount] = useState(0);

    // If infinite, we virtually extend the text, but physically we might just loop
    const totalChars = targetText.length;
    // For infinite mode, isFinished is determined externally (by time), so we don't auto-finish here unless non-infinite
    const isFinished = !isInfinite && cursor >= totalChars;

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

        // Looping logic:
        // Calculate effective index in the source string
        const effectiveIndex = cursor % totalChars;
        const expectedChar = targetText[effectiveIndex];

        let inputChar = key;
        if (key === 'Enter') inputChar = '\n';

        if (inputChar.length === 1) { // Standard printable character or mapped newline
            setTypedChars(prev => {
                // Keep typedChars a manageable size for infinite typing? 
                // No, we need it for history. Browser can handle a few KB string.
                return prev + inputChar;
            });

            if (inputChar !== expectedChar) {
                setErrorCount(prev => prev + 1);
            }

            setCursor(prev => prev + 1);

            // Finish check ONLY if non-infinite
            if (!isInfinite && cursor + 1 >= totalChars) {
                setEndTime(Date.now());
            }
        }
    }, [cursor, isFinished, startTime, targetText, totalChars, isInfinite]);

    // WPM Calculation
    const wpm = (() => {
        if (!startTime) return 0;
        const end = endTime || Date.now();
        const durationInMinutes = (end - startTime) / 60000;
        if (durationInMinutes === 0) return 0;
        // Standard: 5 chars = 1 word
        const words = (cursor - errorCount) / 5; // Net WPM usually excludes errors
        return Math.max(0, Math.round(words / durationInMinutes));
    })();

    // Accuracy
    const accuracy = (() => {
        if (cursor === 0) return 100;
        const correct = cursor - errorCount;
        return Math.max(0, Math.round((correct / cursor) * 100));
    })();

    return {
        cursor, // Total keystrokes processed
        typedChars,
        wpm,
        accuracy,
        isFinished,
        handleKeyPress,
        reset,
        startTime // Exposed for timer sync if needed
    };
};
