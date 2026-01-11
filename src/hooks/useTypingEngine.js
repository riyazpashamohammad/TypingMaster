import { useState, useEffect, useCallback, useRef } from 'react';

export const useTypingEngine = (targetText, isInfinite = false) => {
    const [cursor, setCursor] = useState(0);
    const [typedChars, setTypedChars] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [errorCount, setErrorCount] = useState(0);

    // Pause functionality
    const [pausedDuration, setPausedDuration] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const pauseStartTimeRef = useRef(null);

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
        setPausedDuration(0);
        setIsPaused(false);
        pauseStartTimeRef.current = null;
    }, []);

    const start = useCallback(() => {
        if (!startTime) {
            setStartTime(Date.now());
        }
    }, [startTime]);

    const pause = useCallback(() => {
        if (!isPaused && startTime && !endTime) {
            setIsPaused(true);
            pauseStartTimeRef.current = Date.now();
        }
    }, [isPaused, startTime, endTime]);

    const resume = useCallback(() => {
        if (isPaused && pauseStartTimeRef.current) {
            const pausedTime = Date.now() - pauseStartTimeRef.current;
            setPausedDuration(prev => prev + pausedTime);
            setIsPaused(false);
            pauseStartTimeRef.current = null;
        }
    }, [isPaused]);

    const handleKeyPress = useCallback((key) => {
        if (isFinished || isPaused) return;

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
    }, [cursor, isFinished, startTime, targetText, totalChars, isInfinite, isPaused]);

    const registerError = useCallback(() => {
        if (!startTime) {
            setStartTime(Date.now());
        }
        if (isPaused) return;
        setErrorCount(prev => prev + 1);
    }, [startTime, isPaused]);

    // WPM Calculation
    const wpm = (() => {
        if (!startTime) return 0;
        const now = isPaused ? (pauseStartTimeRef.current || Date.now()) : (endTime || Date.now());
        const totalElapsed = now - startTime;
        const effectiveDuration = totalElapsed - pausedDuration;
        const durationInMinutes = effectiveDuration / 60000;

        if (durationInMinutes <= 0) return 0;

        // In Infinite/Drill mode, cursor only moves on success. So cursor = Correct Chars.
        // In Standard mode, cursor = Correct + Errors (internal).
        // Since we split error handling in Drill mode (using registerError), 
        // we can assume `cursor` count is clean of errors if isInfinite.
        const correctChars = isInfinite ? cursor : Math.max(0, cursor - errorCount);

        const words = correctChars / 5;
        return Math.max(0, Math.round(words / durationInMinutes));
    })();

    // Accuracy
    const accuracy = (() => {
        // Infinite/Drill Mode: cursor = correct keystrokes (because blocked on error), errorCount = wrong.
        if (isInfinite) {
            const total = cursor + errorCount;
            if (total === 0) return 100;
            return Math.max(0, Math.round((cursor / total) * 100));
        }

        // Standard Mode: cursor = (correct + wrong), errorCount = wrong.
        if (cursor === 0) return 100;
        const correct = Math.max(0, cursor - errorCount);
        return Math.max(0, Math.round((correct / cursor) * 100));
    })();

    return {
        cursor, // Total keystrokes processed
        typedChars,
        wpm,
        accuracy,
        isFinished,
        handleKeyPress,
        registerError,
        reset,
        start,
        pause,
        resume,
        startTime // Exposed for timer sync if needed
    };
};
