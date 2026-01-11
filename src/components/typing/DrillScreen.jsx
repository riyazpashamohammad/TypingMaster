import React, { useEffect, useState, useRef } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import VirtualKeyboard from './VirtualKeyboard';
import HandsOverlay from './HandsOverlay';
import { getFingerForChar } from '../../utils/keyboardUtils';
import { useUser } from '../../context/UserContext';
import { X, Clock, BarChart2 } from 'lucide-react';

const DrillScreen = ({ section, onComplete, onClose }) => {
    // section: { id, title, type, content, keys?, duration? }
    const DURATION_SECONDS = 300; // 5 Minutes Default
    const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
    const [showPreInfo, setShowPreInfo] = useState(true);
    const [infoPage, setInfoPage] = useState(0); // For paginated info sections

    // Results State
    const [showResults, setShowResults] = useState(false);

    // Only drill type is infinite
    const isDrill = section.type === 'drill';
    const content = section.content || " ";

    const engine = useTypingEngine(content, isDrill);
    const { saveLessonProgress } = useUser();

    const [isPaused, setIsPaused] = useState(false);
    const lastActivityRef = useRef(Date.now());

    // Refs for stats to access inside Timer without re-triggering it
    const statsRef = useRef({ wpm: 0, accuracy: 100 });
    useEffect(() => {
        statsRef.current = { wpm: engine.wpm, accuracy: engine.accuracy };
    }, [engine.wpm, engine.accuracy]);

    // Timer Logic (Refactored for Pause support)
    useEffect(() => {
        // If results are showing, stop timer interactions
        if (showPreInfo || !isDrill || isPaused || showResults) return;

        // Ensure engine has started
        if (!engine.startTime) {
            // Waiting for start
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // Time is up!
                    saveLessonProgress(section.id.split('.')[0], section.id, statsRef.current);
                    // Show results instead of completing immediately
                    setShowResults(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isDrill, showPreInfo, isPaused, showResults, saveLessonProgress, section.id]);

    // Auto-Pause Monitor
    useEffect(() => {
        if (showPreInfo || isPaused || !isDrill || showResults) return;

        const checkActivity = setInterval(() => {
            if (Date.now() - lastActivityRef.current > 15000) {
                setIsPaused(true);
            }
        }, 1000);

        return () => clearInterval(checkActivity);
    }, [isPaused, showPreInfo, isDrill, showResults]);

    // Sync Pause State with Engine for WPM correctness
    useEffect(() => {
        if (isPaused || showResults) {
            engine.pause();
        } else {
            engine.resume();
        }
    }, [isPaused, showResults, engine]);

    const [wrongKey, setWrongKey] = useState(null);

    // Keyboard Hook
    useEffect(() => {
        // Space to start
        if (showPreInfo && section.type === 'drill') {
            const handleSpace = (e) => {
                if (e.code === 'Space') {
                    setShowPreInfo(false);
                    lastActivityRef.current = Date.now();
                    e.preventDefault();
                }
            };
            window.addEventListener('keydown', handleSpace);
            return () => window.removeEventListener('keydown', handleSpace);
        }

        // Space to continue from Results
        if (showResults) {
            const handleResultsSpace = (e) => {
                if (e.code === 'Space' || e.key === 'Enter') {
                    handleContinue();
                    e.preventDefault();
                }
            };
            window.addEventListener('keydown', handleResultsSpace);
            return () => window.removeEventListener('keydown', handleResultsSpace);
        }

        const handleKeyDown = (e) => {
            if (isPaused) {
                // Optional: Allow Space to resume
                if (e.code === 'Space') {
                    setIsPaused(false);
                    lastActivityRef.current = Date.now();
                    e.preventDefault();
                }
                return;
            }

            // Don't type if showing results
            if (showResults) return;

            lastActivityRef.current = Date.now();

            if (showPreInfo) {
                if ((section.type === 'info' || section.type === 'new_keys') && e.key === ' ') {
                    const content = section.content;
                    const isPaginated = Array.isArray(content);
                    if (isPaginated && infoPage < content.length - 1) {
                        setInfoPage(prev => prev + 1);
                    } else {
                        // Info sections are always "perfect" completion
                        const stats = { wpm: 0, accuracy: 100 };
                        saveLessonProgress(section.id.split('.')[0], section.id, stats);
                        onComplete(stats);
                    }
                }
                return;
            }

            // Blocking Mode Logic (Stop-on-Error)
            const effectiveCursor = engine.cursor % content.length;
            const expectedChar = isDrill ? content[effectiveCursor] : (section.content ? section.content[engine.cursor] : null);

            // Normalize comparison
            let inputKey = e.key;
            let targetKey = expectedChar;

            // Simple check to ignore modifier keys alone (Shift, Control, etc.)
            if (inputKey.length > 1 && inputKey !== 'Enter' && inputKey !== 'Backspace') return;

            // If we are finished (non-drill), ignore
            if (!isDrill && engine.isFinished) return;
            if (!expectedChar) return; // changing section or done

            // Check if match
            const isMatch = (inputKey === targetKey) || (targetKey === '\n' && inputKey === 'Enter');

            if (isMatch) {
                setWrongKey(null);
                playSound('click'); // Play click sound
                engine.handleKeyPress(e.key);
            } else {
                // Wrong key!
                e.preventDefault();
                setWrongKey(inputKey);
                playSound('error'); // Play error sound
                engine.registerError(); // Report error for accuracy
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engine, showPreInfo, onComplete, section, isDrill, infoPage, content, wrongKey, isPaused, showResults]);

    // Separate effect for completion (Non-Drill)
    useEffect(() => {
        if (!isDrill && engine.isFinished && !showResults) {
            setShowResults(true);
        }
    }, [engine.isFinished, isDrill, showResults]);

    const handleContinue = () => {
        const finalStats = isDrill ? statsRef.current : { wpm: engine.wpm, accuracy: engine.accuracy };
        onComplete(finalStats); // This triggers parent navigation
    };


    // Active Logic
    const effectiveCursor = engine.cursor % content.length;
    const currentChar = isDrill ? content[effectiveCursor] : (section.content ? section.content[engine.cursor] : null);
    const activeFinger = getFingerForChar(currentChar);

    // INFO / NEW KEYS RENDER
    if (section.type === 'info' || section.type === 'new_keys') {
        const content = section.content;
        const isPaginated = Array.isArray(content);
        const currentText = isPaginated ? content[infoPage] : content;

        const handleNextPage = () => {
            if (isPaginated && infoPage < content.length - 1) {
                setInfoPage(prev => prev + 1);
            } else {
                const stats = { wpm: 0, accuracy: 100 };
                saveLessonProgress(section.id.split('.')[0], section.id, stats);
                onComplete(stats);
            }
        };

        const handlePrevPage = () => {
            if (isPaginated && infoPage > 0) {
                setInfoPage(prev => prev - 1);
            }
        };

        // Reset page when section changes
        useEffect(() => {
            setInfoPage(0);
        }, [section.id]);

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 relative p-4">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100"><X /></button>

                <h2 className="text-3xl font-bold text-blue-900 mb-8">{section.title}</h2>
                <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-2xl w-full border border-gray-200 flex flex-col items-center">

                    <div className="text-xl mb-8 font-medium text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px] flex items-center justify-center">
                        {section.type === 'new_keys' && !section.content ? `New Keys: ${section.keys.join(', ').toUpperCase()}` : currentText}
                    </div>

                    <div className="mb-8 w-full flex justify-center">
                        {section.type === 'new_keys' && (
                            <>
                                <div className="absolute opacity-0 pointer-events-none">
                                    <VirtualKeyboard activeKeys={section.keys || []} />
                                </div>
                                <HandsOverlay
                                    activeFinger={null}
                                    activeFingers={section.type === 'new_keys' && section.keys ? section.keys.map(k => getFingerForChar(k)).filter(Boolean) : []}
                                />
                            </>
                        )}
                        {section.type === 'info' && (
                            <div className="w-full h-1 bg-gray-100 rounded mb-4"></div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 w-full justify-center">
                        {isPaginated && infoPage > 0 && (
                            <button onClick={handlePrevPage} className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition">
                                Back
                            </button>
                        )}

                        <button
                            onClick={handleNextPage}
                            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 animate-pulse"
                        >
                            {isPaginated && infoPage < content.length - 1 ? 'Next' : 'Continue (Space)'}
                        </button>
                    </div>

                    {isPaginated && (
                        <div className="mt-6 flex gap-2">
                            {content.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full ${idx === infoPage ? 'bg-blue-600' : 'bg-gray-300'}`} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // RESULTS OVERLAY
    if (showResults) {
        const finalStats = isDrill ? statsRef.current : { wpm: engine.wpm, accuracy: engine.accuracy };
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-8">
                <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Drill Complete!</h2>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Speed</p>
                            <p className="text-4xl font-bold text-blue-600">{finalStats.wpm} <span className="text-lg text-gray-400">wpm</span></p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Accuracy</p>
                            <p className={`text-4xl font-bold ${finalStats.accuracy >= 94 ? 'text-green-500' : 'text-red-500'}`}>
                                {finalStats.accuracy}%
                            </p>
                        </div>
                    </div>

                    {finalStats.accuracy < 94 && (
                        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                            Goal: 94% Accuracy. Please Retry.
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleContinue}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
                        >
                            {finalStats.accuracy >= 94 ? 'Continue (Space)' : 'Finish'}
                        </button>
                        {/* Parent LessonPage handles retry logic if accuracy is low, so we just "Finish" via Continue. 
                            However, user might want to simple Re-play here? 
                            LessonPage handles the logic: if < 94, it alerts and asks retry. 
                            So clicking Continue will trigger that alert. */}
                    </div>
                </div>
            </div>
        );
    }

    // Pre-Drill Info Modal (Screenshot Match)
    if (showPreInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50/50 p-4 relative">
                <div className="bg-white border border-green-400 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
                    <div className="bg-gradient-to-r from-green-200 to-green-300 p-3 border-b border-green-400 font-bold text-gray-800 flex justify-between items-center">
                        <span>Drill Information</span>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-bold text-gray-700">Duration</span>
                            <div className="col-span-2 flex items-center gap-2 text-sm">
                                <BarChart2 size={16} className="text-blue-500" />
                                <span>3 - 5 minutes (based on progress)</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-bold text-gray-700">Accuracy Goal</span>
                            <div className="col-span-2">
                                <select className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm">
                                    <option>94% Intermediate</option>
                                    <option>98% Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-start">
                            <span className="font-bold text-gray-700">Objective</span>
                            <div className="col-span-2 text-sm text-gray-600">
                                Reinforcement practice to develop smooth and accurate keystrokes and even rhythm.
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t flex justify-start">
                        <button
                            onClick={() => setShowPreInfo(false)}
                            className="bg-gradient-to-b from-green-100 to-green-200 border border-green-300 text-green-900 px-6 py-2 rounded shadow-sm hover:from-green-200 hover:to-green-300 font-bold text-sm flex items-center gap-2"
                        >
                            ▶ Begin drill (Space)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // MAIN DRILL INTERFACE (Split Layout)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const WINDOW_SIZE = 15;
    const startWindow = engine.cursor;
    const endWindow = startWindow + WINDOW_SIZE;

    const renderChar = (char, index, absoluteIndex) => {
        let status = 'future';
        if (absoluteIndex === engine.cursor) status = 'current';

        let className = "inline-block transition-all duration-75 border-b-4 mx-1 ";

        if (status === 'current') {
            className += "text-blue-900 border-blue-600 scale-125 font-black transform origin-bottom ";
        } else {
            className += "text-gray-500 border-transparent opacity-80 ";
        }

        if (char === '\n') {
            return <span key={absoluteIndex} className={className + " text-gray-400 font-sans"}>↵</span>;
        }

        if (char === ' ') {
            return <span key={absoluteIndex} className={className + " w-12 text-center"}>&nbsp;</span>;
        } return <span key={absoluteIndex} className={className}>{char}</span>;
    };

    const playSound = (type) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            if (type === 'error') {
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.1);
            } else {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.05);
            }
        } catch (e) {
            console.error("Audio Playback Error", e);
        }
    };

    const renderedContent = (
        <div className="flex items-center justify-center w-full h-full p-8 overflow-hidden select-none outline-none">
            <div className="text-8xl font-mono leading-none tracking-wider whitespace-nowrap flex items-center justify-center">
                {Array.from({ length: WINDOW_SIZE }).map((_, i) => {
                    const absoluteIndex = startWindow + i;
                    const effectiveIdx = absoluteIndex % content.length;
                    const char = content[effectiveIdx] || ' ';
                    return renderChar(char, i, absoluteIndex);
                })}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <div className="flex-1 flex flex-col p-8 gap-4 relative">
                {isPaused && (
                    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">Drill Paused</h2>
                        <p className="text-gray-600 text-lg mb-8">Inactive for more than 15s or manually paused.</p>
                        <button
                            onClick={() => { setIsPaused(false); lastActivityRef.current = Date.now(); }}
                            className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-xl hover:bg-blue-700 hover:scale-105 transition transform animate-bounce"
                        >
                            Resume Drill
                        </button>
                        <p className="mt-4 text-sm text-gray-500">Press Space to Resume</p>
                    </div>
                )}

                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center overflow-hidden relative min-h-[200px]">
                    {renderedContent}
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 flex flex-col items-center justify-center gap-4">
                    <div className="scale-90 origin-bottom">
                        <VirtualKeyboard
                            activeKeys={currentChar ? [currentChar.toLowerCase()] : []}
                            wrongKey={wrongKey}
                            pressedKey={null}
                        />
                    </div>

                    <div className="scale-75 origin-top -mt-8">
                        <HandsOverlay
                            activeFinger={activeFinger}
                            activeFingers={[]}
                        />
                    </div>
                </div>
            </div>

            <div className="w-80 bg-blue-100/50 border-l border-blue-200 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2"><BarChart2 size={18} /> Your Progress</h3>
                        <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 mb-8 h-48 flex items-end gap-1 justify-between">
                        {[...Array(10)].map((_, i) => {
                            const height = Math.min(100, Math.max(20, (engine.wpm / 10) * (i + 1) + Math.random() * 20));
                            return (
                                <div key={i} className={`w-full bg-blue-${i > 7 ? '200' : '100'} border border-blue-300 rounded-sm`} style={{ height: `${height}%` }}></div>
                            );
                        })}
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Net Speed</span>
                            <span className="font-bold">{engine.wpm} wpm</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, engine.wpm * 2)}%` }}></div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Accuracy</span>
                            <span className={`font-bold ${engine.accuracy < 94 ? 'text-red-500' : 'text-green-600'}`}>{engine.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${engine.accuracy < 94 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${engine.accuracy}%` }}></div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-6 border-t border-blue-200 pt-6">
                        <p className="font-bold text-gray-700 mb-2">Time</p>
                        <div className="flex items-center justify-between">
                            <p className="text-4xl font-bold font-mono text-gray-900">{formatTime(timeLeft)}</p>
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className={`p-2 rounded-full ${isPaused ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                                title={isPaused ? "Resume" : "Pause"}
                            >
                                {isPaused ? '▶' : 'II'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => { saveLessonProgress(section.id.split('.')[0], section.id, { wpm: engine.wpm, accuracy: engine.accuracy }); setShowResults(true); }}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Next
                        </button>
                        <button onClick={onClose} className="w-full py-3 bg-white border border-blue-300 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrillScreen;
