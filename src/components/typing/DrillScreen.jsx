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
        if (showPreInfo || !isDrill || isPaused) return;

        // Ensure engine has started
        if (!engine.startTime) {
            // We rely on engine.handleKeyPress to start it usually, 
            // but if we pause, we need to manage time independently of engine.startTime absolute diff.
            // Actually, engine.startTime is used for WPM. 
            // If we pause, WPM calculation in engine might get messed up because it uses (now - start).
            // We might need to correct engine's duration used for WPM?
            // For now, let's focus on the Countdown Timer.
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) { // Changed to <= 1 to catch the transition to 0 neatly
                    clearInterval(interval);
                    saveLessonProgress(section.id.split('.')[0], section.id, statsRef.current);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isDrill, showPreInfo, isPaused, onComplete, saveLessonProgress, section.id]); // Removed engine/stats from deps

    // Auto-Pause Monitor
    useEffect(() => {
        if (showPreInfo || isPaused || !isDrill) return;

        const checkActivity = setInterval(() => {
            if (Date.now() - lastActivityRef.current > 15000) {
                setIsPaused(true);
            }
        }, 1000);

        return () => clearInterval(checkActivity);
    }, [isPaused, showPreInfo, isDrill]);

    // Sync Pause State with Engine for WPM correctness
    useEffect(() => {
        if (isPaused) {
            engine.pause();
        } else {
            engine.resume();
        }
    }, [isPaused, engine]);

    const [wrongKey, setWrongKey] = useState(null);

    // Keyboard Hook
    useEffect(() => {
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

            lastActivityRef.current = Date.now();

            if (showPreInfo) {
                if ((section.type === 'info' || section.type === 'new_keys') && e.key === ' ') {
                    const content = section.content;
                    const isPaginated = Array.isArray(content);
                    if (isPaginated && infoPage < content.length - 1) {
                        setInfoPage(prev => prev + 1);
                    } else {
                        saveLessonProgress(section.id.split('.')[0], section.id, { wpm: 0, accuracy: 100 });
                        onComplete();
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
            // Note: engine handles \n as 'Enter' input usually, or just '\n'
            // We need to match what the user types physically

            const isMatch = (inputKey === targetKey) || (targetKey === '\n' && inputKey === 'Enter');

            if (isMatch) {
                setWrongKey(null);
                playSound('click'); // Play click sound
                engine.handleKeyPress(e.key);

                // For non-drills check finish
                if (!isDrill && engine.cursor + 1 >= (section.content?.length || 0)) {
                    // Check completion
                }

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
    }, [engine, showPreInfo, onComplete, section, isDrill, infoPage, content, wrongKey]);

    // Separate effect for completion
    useEffect(() => {
        if (!isDrill && engine.isFinished) {
            onComplete();
        }
    }, [engine.isFinished, isDrill, onComplete]);


    // Active Logic
    const effectiveCursor = engine.cursor % content.length;
    const currentChar = isDrill ? content[effectiveCursor] : (section.content ? section.content[engine.cursor] : null);
    const activeFinger = getFingerForChar(currentChar);

    // ... (Info/New Keys render logic remains the same, skipping for brevity in this replace block if possible, but tool requires contiguous)
    // Actually I can't skip the middle chunks easily with replace_file_content if I want to keep the file valid. 
    // I will use `multi_replace_file_content` or just include the middle part if it's small? 
    // It's large (lines 93-222).
    // I will use `replace_file_content` just for the hook part, and then another for the render part.
    // This call only targets the HOOK part (lines 42-85 replacement).

    // WAIT. I used `replace_file_content`. I need to be careful. 
    // The previous tool call was for `handleKeyDown` logic. 
    // I will return the replacement just for that block.

    // ... Existing Info Render Logic ...
    if (section.type === 'info' || section.type === 'new_keys') {
        const content = section.content;
        const isPaginated = Array.isArray(content);
        const currentText = isPaginated ? content[infoPage] : content;

        const handleNextPage = () => {
            if (isPaginated && infoPage < content.length - 1) {
                setInfoPage(prev => prev + 1);
            } else {
                saveLessonProgress(section.id.split('.')[0], section.id, { wpm: 0, accuracy: 100 });
                onComplete();
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
                        {/* If it's pure info, maybe show a generic graphic or nothing? For now keeping hands only for new_keys */}
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

    // Pre-Drill Info Modal (Screenshot Match)
    if (showPreInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50/50 p-4 relative">
                {/* Background blurred or just modal */}
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

    // Text Rendering Logic for "Big and Clear"
    // We only show a limited window to focus the user (Short Bursts)
    const WINDOW_SIZE = 15; // Shorter window to fit 8xl text on single line
    const startWindow = engine.cursor; // Start EXACTLY at the cursor (hide past)
    const endWindow = startWindow + WINDOW_SIZE;

    const renderChar = (char, index, absoluteIndex) => {
        let status = 'future';
        if (absoluteIndex === engine.cursor) status = 'current';

        let className = "inline-block transition-all duration-75 border-b-4 mx-1 ";

        if (status === 'current') {
            // Current cursor highlight
            className += "text-blue-900 border-blue-600 scale-125 font-black transform origin-bottom ";
        } else {
            // Future
            className += "text-gray-500 border-transparent opacity-80 ";
        }

        if (char === '\n') {
            // Visible Enter Symbol
            return <span key={absoluteIndex} className={className + " text-gray-400 font-sans"}>↵</span>;
        }

        // Handle space
        if (char === ' ') {
            return <span key={absoluteIndex} className={className + " w-12 text-center"}>&nbsp;</span>;
        } return <span key={absoluteIndex} className={className}>{char}</span>;
    };

    // Sound Effects
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
                // Click sound
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Quieter click
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
                    const char = content[effectiveIdx] || ' '; // Fallback safely
                    return renderChar(char, i, absoluteIndex);
                })}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* LEFT PANE: Content & Keyboard */}
            <div className="flex-1 flex flex-col p-8 gap-4 relative">
                {/* Paused Overlay */}
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

                {/* Text Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center overflow-hidden relative min-h-[200px]">
                    {renderedContent}
                </div>

                {/* Keyboard & Hands Area */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 flex flex-col items-center justify-center gap-4">
                    <div className="scale-90 origin-bottom">
                        <VirtualKeyboard
                            activeKeys={currentChar ? [currentChar.toLowerCase()] : []}
                            wrongKey={wrongKey}
                            pressedKey={null}
                        />
                    </div>

                    {/* Hands Overlay */}
                    <div className="scale-75 origin-top -mt-8">
                        <HandsOverlay
                            activeFinger={activeFinger}
                            activeFingers={[]}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT PANE: Sidebar Stats */}
            <div className="w-80 bg-blue-100/50 border-l border-blue-200 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2"><BarChart2 size={18} /> Your Progress</h3>
                        <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
                    </div>

                    {/* Bar Chart Placeholder */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 mb-8 h-48 flex items-end gap-1 justify-between">
                        {/* Fake bars growing */}
                        {[...Array(10)].map((_, i) => {
                            const height = Math.min(100, Math.max(20, (engine.wpm / 10) * (i + 1) + Math.random() * 20)); // Dynamic fake
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
                            onClick={() => { saveLessonProgress(section.id.split('.')[0], section.id, { wpm: engine.wpm, accuracy: engine.accuracy }); onComplete(); }}
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
