import React, { useEffect, useState, useRef } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import VirtualKeyboard from './VirtualKeyboard';
import HandsOverlay from './HandsOverlay';
import { getFingerForChar } from '../../utils/keyboardUtils';
import { useUser } from '../../context/UserContext';
import { X, Clock, BarChart2 } from 'lucide-react';

const DrillScreen = ({ section, onComplete, onClose }) => {
    // section: { id, title, type, content, keys?, duration? }
    const DURATION_SECONDS = 300; // 5 Minutes
    const NUM_BARS = 30; // 30 bars -> 10 seconds per bar
    const SECONDS_PER_BAR = DURATION_SECONDS / NUM_BARS;

    const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
    const [showPreInfo, setShowPreInfo] = useState(true);
    const [infoPage, setInfoPage] = useState(0);

    // Results State
    const [showResults, setShowResults] = useState(false);

    // Graph State: Array of boolean | null. true=green, false=red, null=empty
    const [barHistory, setBarHistory] = useState(Array(NUM_BARS).fill(null));

    // Track previous stats for interval calculation
    const intervalRef = useRef({
        lastCursor: 0,
        lastErrors: 0,
        currentBarIndex: 0
    });

    const isDrill = section.type === 'drill';
    const content = section.content || " ";

    const engine = useTypingEngine(content, isDrill);
    const { saveLessonProgress } = useUser();

    const [isPaused, setIsPaused] = useState(false);
    const lastActivityRef = useRef(Date.now());

    const statsRef = useRef({ wpm: 0, accuracy: 100 });
    useEffect(() => {
        statsRef.current = { wpm: engine.wpm, accuracy: engine.accuracy };
    }, [engine.wpm, engine.accuracy]);

    // Timer Logic 
    useEffect(() => {
        if (showPreInfo || !isDrill || isPaused || showResults) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                const nextTime = prev - 1;
                const elapsed = DURATION_SECONDS - nextTime;

                // Check if we finished a bar interval
                const barIndex = Math.floor(elapsed / SECONDS_PER_BAR);
                const prevBarIndex = intervalRef.current.currentBarIndex;

                if (barIndex > prevBarIndex && barIndex <= NUM_BARS) {
                    // Interval Finished! Calculate Stats for this interval.
                    const currentCursor = engine.cursor; // Total chars typed 
                    const currentErrors = engine.errorCount;

                    const deltaCursor = currentCursor - intervalRef.current.lastCursor;
                    const deltaErrors = currentErrors - intervalRef.current.lastErrors;

                    // Avoid division by zero
                    let intervalAcc = 100;
                    if (deltaCursor > 0) {
                        intervalAcc = Math.max(0, ((deltaCursor - deltaErrors) / deltaCursor) * 100);
                    }

                    // Store result
                    // Note: If user didn't type anything (deltaCursor=0), we can count it as failure or neutral. 
                    // Let's say failure if they were idling, but passing if 100% (default). 
                    // Let's go strict: idle = red.
                    const isSuccess = deltaCursor > 0 ? intervalAcc >= 94 : false;

                    setBarHistory(prevH => {
                        const newH = [...prevH];
                        // Fill all bars up to current (in case of lag/jump)
                        for (let i = prevBarIndex; i < barIndex; i++) {
                            if (i < NUM_BARS) newH[i] = isSuccess;
                        }
                        return newH;
                    });

                    // Update Ref
                    intervalRef.current = {
                        lastCursor: currentCursor,
                        lastErrors: currentErrors,
                        currentBarIndex: barIndex
                    };
                }

                if (nextTime <= 0) {
                    clearInterval(interval);
                    saveLessonProgress(section.id.split('.')[0], section.id, statsRef.current);
                    setShowResults(true);
                    return 0;
                }
                return nextTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isDrill, showPreInfo, isPaused, showResults, saveLessonProgress, section.id, engine.cursor, engine.errorCount]);

    // Auto-Pause
    useEffect(() => {
        if (showPreInfo || isPaused || !isDrill || showResults) return;
        const checkActivity = setInterval(() => {
            if (Date.now() - lastActivityRef.current > 15000) {
                setIsPaused(true);
            }
        }, 1000);
        return () => clearInterval(checkActivity);
    }, [isPaused, showPreInfo, isDrill, showResults]);

    useEffect(() => {
        if (isPaused || showResults) engine.pause();
        else engine.resume();
    }, [isPaused, showResults, engine]);

    const [wrongKey, setWrongKey] = useState(null);

    // Keyboard Hook
    useEffect(() => {
        if (showPreInfo && section.type === 'drill') {
            const handleSpace = (e) => {
                if (e.code === 'Space') {
                    setShowPreInfo(false);
                    lastActivityRef.current = Date.now();
                    // Initialize ref stats on start
                    intervalRef.current = {
                        lastCursor: engine.cursor,
                        lastErrors: engine.errorCount,
                        currentBarIndex: 0
                    };
                    e.preventDefault();
                }
            };
            window.addEventListener('keydown', handleSpace);
            return () => window.removeEventListener('keydown', handleSpace);
        }

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
                if (e.code === 'Space') {
                    setIsPaused(false);
                    lastActivityRef.current = Date.now();
                    e.preventDefault();
                }
                return;
            }
            if (showResults) return;

            // Update Activity
            lastActivityRef.current = Date.now();

            if (showPreInfo) {
                if ((section.type === 'info' || section.type === 'new_keys') && e.key === ' ') {
                    const content = section.content;
                    const isPaginated = Array.isArray(content);
                    if (isPaginated && infoPage < content.length - 1) {
                        setInfoPage(prev => prev + 1);
                    } else {
                        const stats = { wpm: 0, accuracy: 100 };
                        saveLessonProgress(section.id.split('.')[0], section.id, stats);
                        onComplete(stats);
                    }
                }
                return;
            }

            const effectiveCursor = engine.cursor % content.length;
            const expectedChar = isDrill ? content[effectiveCursor] : (section.content ? section.content[engine.cursor] : null);

            let inputKey = e.key;
            let targetKey = expectedChar;

            if (inputKey.length > 1 && inputKey !== 'Enter' && inputKey !== 'Backspace') return;
            if (!isDrill && engine.isFinished) return;
            if (!expectedChar) return;

            const isMatch = (inputKey === targetKey) || (targetKey === '\n' && inputKey === 'Enter');

            if (isMatch) {
                setWrongKey(null);
                playSound('click');
                engine.handleKeyPress(e.key);
            } else {
                e.preventDefault();
                setWrongKey(inputKey);
                playSound('error');
                engine.registerError();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engine, showPreInfo, onComplete, section, isDrill, infoPage, content, wrongKey, isPaused, showResults]);

    useEffect(() => {
        if (!isDrill && engine.isFinished && !showResults) {
            setShowResults(true);
        }
    }, [engine.isFinished, isDrill, showResults]);

    const handleContinue = () => {
        const finalStats = isDrill ? statsRef.current : { wpm: engine.wpm, accuracy: engine.accuracy };
        onComplete(finalStats);
    };

    const effectiveCursor = engine.cursor % content.length;
    const currentChar = isDrill ? content[effectiveCursor] : (section.content ? section.content[engine.cursor] : null);
    const activeFinger = getFingerForChar(currentChar);

    if (section.type === 'info' || section.type === 'new_keys') {
        // ... (Keep existing Info Logic)
        const content = section.content;
        const isPaginated = Array.isArray(content);
        const currentText = isPaginated ? content[infoPage] : content;
        const handleNextPage = () => {
            if (isPaginated && infoPage < content.length - 1) setInfoPage(prev => prev + 1);
            else {
                saveLessonProgress(section.id.split('.')[0], section.id, { wpm: 0, accuracy: 100 });
                onComplete({ wpm: 0, accuracy: 100 });
            }
        };
        const handlePrevPage = () => { if (isPaginated && infoPage > 0) setInfoPage(prev => prev - 1); };
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
                                <div className="absolute opacity-0 pointer-events-none"><VirtualKeyboard activeKeys={section.keys || []} /></div>
                                <HandsOverlay activeFinger={null} activeFingers={section.type === 'new_keys' && section.keys ? section.keys.map(k => getFingerForChar(k)).filter(Boolean) : []} />
                            </>
                        )}
                        {section.type === 'info' && <div className="w-full h-1 bg-gray-100 rounded mb-4"></div>}
                    </div>
                    <div className="flex items-center gap-4 w-full justify-center">
                        {isPaginated && infoPage > 0 && <button onClick={handlePrevPage} className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition">Back</button>}
                        <button onClick={handleNextPage} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 animate-pulse">{isPaginated && infoPage < content.length - 1 ? 'Next' : 'Continue (Space)'}</button>
                    </div>
                    {isPaginated && (
                        <div className="mt-6 flex gap-2">
                            {content.map((_, idx) => <div key={idx} className={`w-2 h-2 rounded-full ${idx === infoPage ? 'bg-blue-600' : 'bg-gray-300'}`} />)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

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
                            <p className={`text-4xl font-bold ${finalStats.accuracy >= 94 ? 'text-green-500' : 'text-red-500'}`}>{finalStats.accuracy}%</p>
                        </div>
                    </div>
                    {finalStats.accuracy < 94 && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">Goal: 94% Accuracy. Please Retry.</div>}
                    <div className="flex flex-col gap-3">
                        <button onClick={handleContinue} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">{finalStats.accuracy >= 94 ? 'Continue (Space)' : 'Finish'} </button>
                        <button onClick={onClose} className="w-full py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 font-medium rounded-xl transition-colors">Back to Menu</button>
                    </div>
                </div>
            </div>
        );
    }

    if (showPreInfo) {
        // ... (Keep existing PreInfo Logic)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50/50 p-4 relative">
                <div className="bg-white border border-green-400 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
                    <div className="bg-gradient-to-r from-green-200 to-green-300 p-3 border-b border-green-400 font-bold text-gray-800 flex justify-between items-center"><span>Drill Information</span></div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-bold text-gray-700">Duration</span>
                            <div className="col-span-2 flex items-center gap-2 text-sm"><BarChart2 size={16} className="text-blue-500" /><span>3 - 5 minutes (based on progress)</span></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-bold text-gray-700">Accuracy Goal</span>
                            <div className="col-span-2"><select className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm"><option>94% Intermediate</option><option>98% Advanced</option></select></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-start"><span className="font-bold text-gray-700">Objective</span><div className="col-span-2 text-sm text-gray-600">Reinforcement practice to develop smooth and accurate keystrokes and even rhythm.</div></div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-start"><button onClick={() => setShowPreInfo(false)} className="bg-gradient-to-b from-green-100 to-green-200 border border-green-300 text-green-900 px-6 py-2 rounded shadow-sm hover:from-green-200 hover:to-green-300 font-bold text-sm flex items-center gap-2">▶ Begin drill (Space)</button></div>
                </div>
            </div>
        );
    }

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
        if (status === 'current') className += "text-blue-900 border-blue-600 scale-125 font-black transform origin-bottom ";
        else className += "text-gray-500 border-transparent opacity-80 ";

        if (char === '\n') return <span key={absoluteIndex} className={className + " text-gray-400 font-sans"}>↵</span>;
        if (char === ' ') return <span key={absoluteIndex} className={className + " w-12 text-center"}>&nbsp;</span>;
        return <span key={absoluteIndex} className={className}>{char}</span>;
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
                oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.1);
            } else {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
                oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.05);
            }
        } catch (e) { }
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
                        <button onClick={() => { setIsPaused(false); lastActivityRef.current = Date.now(); }} className="bg-blue-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-xl hover:bg-blue-700 hover:scale-105 transition transform animate-bounce">Resume Drill</button>
                        <p className="mt-4 text-sm text-gray-500">Press Space to Resume</p>
                    </div>
                )}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center overflow-hidden relative min-h-[200px]">{renderedContent}</div>
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 flex flex-col items-center justify-center gap-4">
                    <div className="scale-90 origin-bottom"><VirtualKeyboard activeKeys={currentChar ? [currentChar.toLowerCase()] : []} wrongKey={wrongKey} pressedKey={null} /></div>
                    <div className="scale-75 origin-top -mt-8"><HandsOverlay activeFinger={activeFinger} activeFingers={[]} /></div>
                </div>
            </div>

            <div className="w-80 bg-blue-100/50 border-l border-blue-200 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2"><BarChart2 size={18} /> Course Progress</h3>
                        <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
                    </div>

                    {/* GRAPH PROGRESS BAR */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 mb-8">
                        <div className="flex justify-between text-sm mb-4 font-bold text-gray-700">
                            <span>Timeline</span>
                            <span className="text-blue-600 text-xs font-normal">{(DURATION_SECONDS - timeLeft) < DURATION_SECONDS ? 'In Progress' : 'Done'}</span>
                        </div>
                        <div className="flex items-end justify-between h-32 gap-[2px]">
                            {barHistory.map((status, i) => {
                                // Determine height: active/future is small, past is full
                                let heightClass = "h-4"; // Default small
                                let colorClass = "bg-gray-200";

                                if (status === true) {
                                    heightClass = "h-full";
                                    colorClass = "bg-green-500";
                                } else if (status === false) {
                                    heightClass = "h-3/4"; // Make errors slightly shorter for visual variety
                                    colorClass = "bg-red-500";
                                } else if (i === intervalRef.current.currentBarIndex) {
                                    // Current active bar (animating or highlighted)
                                    heightClass = "h-full animate-pulse";
                                    colorClass = "bg-blue-300";
                                }

                                return (
                                    <div
                                        key={i}
                                        className={`w-full rounded-sm transition-all duration-500 ${heightClass} ${colorClass}`}
                                        title={`Interval ${i + 1}`}
                                    />
                                );
                            })}
                        </div>
                        <div className="mt-3 flex justify-between text-xs text-gray-400">
                            <span>Start</span>
                            <span>{Math.floor(DURATION_SECONDS / 60)}m</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Net Speed</span><span className="font-bold">{engine.wpm} wpm</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, engine.wpm * 2)}%` }}></div></div>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">Accuracy</span><span className={`font-bold ${engine.accuracy < 94 ? 'text-red-500' : 'text-green-600'}`}>{engine.accuracy}%</span></div>
                        <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${engine.accuracy < 94 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${engine.accuracy}%` }}></div></div>
                    </div>
                </div>

                <div>
                    <div className="mb-6 border-t border-blue-200 pt-6">
                        <p className="font-bold text-gray-700 mb-2">Time</p>
                        <div className="flex items-center justify-between">
                            <p className="text-4xl font-bold font-mono text-gray-900">{formatTime(timeLeft)}</p>
                            <button onClick={() => setIsPaused(!isPaused)} className={`p-2 rounded-full ${isPaused ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`} title={isPaused ? "Resume" : "Pause"}>{isPaused ? '▶' : 'II'}</button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button onClick={() => { saveLessonProgress(section.id.split('.')[0], section.id, { wpm: engine.wpm, accuracy: engine.accuracy }); setShowResults(true); }} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition">Next</button>
                        <button onClick={onClose} className="w-full py-3 bg-white border border-blue-300 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DrillScreen;
