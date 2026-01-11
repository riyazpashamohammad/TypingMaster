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

    // Timer Logic
    useEffect(() => {
        if (showPreInfo || !engine.startTime || !isDrill) return;

        const interval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - engine.startTime) / 1000);
            const remaining = Math.max(0, DURATION_SECONDS - elapsedSeconds);
            setTimeLeft(remaining);

            if (remaining === 0) {
                // Time's up!
                saveLessonProgress(section.id.split('.')[0], section.id, { wpm: engine.wpm, accuracy: engine.accuracy });
                onComplete();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [engine.startTime, isDrill, showPreInfo, onComplete, saveLessonProgress, section.id, engine.wpm, engine.accuracy]);

    // Keyboard Hook
    useEffect(() => {
        if (showPreInfo && section.type === 'drill') {
            const handleSpace = (e) => {
                if (e.code === 'Space') {
                    setShowPreInfo(false);
                    // Prevent default to avoid scrolling or instant double input
                    e.preventDefault();
                }
            };
            window.addEventListener('keydown', handleSpace);
            return () => window.removeEventListener('keydown', handleSpace);
        }

        const handleKeyDown = (e) => {
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

            // Prevent default for special keys
            if (e.key === ' ' || e.key.length === 1) {
                // e.preventDefault(); 
            }
            engine.handleKeyPress(e.key);

            // For non-drills (standard flow), check finish
            if (!isDrill && engine.isFinished) {
                onComplete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engine, showPreInfo, onComplete, section, isDrill, infoPage]);

    // Active Logic
    const effectiveCursor = engine.cursor % content.length;
    const currentChar = isDrill ? content[effectiveCursor] : (section.content ? section.content[engine.cursor] : null);
    const activeFinger = getFingerForChar(currentChar);

    // Info / New Keys Mode (Overlay)
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

    // Slice content for display (Current line + next lines)
    // We want to simulate the view in strings.
    // Let's create a "window" around the cursor.
    // For infinite loop, we construct a virtual string.
    const displayWindowStart = Math.floor(engine.cursor / 50) * 50; // Simple paging
    // Actually, user wants continuous match.
    // Let's just show 3 lines: Previous (if any), Current, Next.

    // Construct display text dynamically for infinite scrolling feel
    // Text Rendering Logic
    // We want to show a history of what was typed (correct/incorrect) and the future text.
    // Since it's infinite, we only show standard window around cursor.

    const WINDOW_SIZE = 200;
    const startWindow = Math.max(0, engine.cursor - 50);
    const endWindow = engine.cursor + 150;

    const renderChar = (char, index, absoluteIndex) => {
        // Character from the source text

        let status = 'future'; // future, correct, incorrect, current
        if (absoluteIndex === engine.cursor) status = 'current';
        else if (absoluteIndex < engine.cursor) {
            // We need to look at typedChars history?
            // Actually engine.typedChars has the history.
            // But typing engine stores 'typedChars' as a string.
            // Wait, for infinite loop, typedChars might get out of sync with "content" index if we just map 1:1?
            // In useTypingEngine, we logic that typedChars maps 1:1 to content[effectiveIndex].

            // Check correctness from history if possible, OR just re-evaluate?
            // Re-evaluating is cheaper for display.
            const effectiveIdx = absoluteIndex % content.length;
            const targetChar = content[effectiveIdx];
            const typedChar = engine.typedChars[absoluteIndex]; // This works if typedChars tracks full history

            status = (typedChar === targetChar) ? 'correct' : 'incorrect';
        }

        let className = "inline-block ";
        if (status === 'current') className += "bg-blue-200 border-b-2 border-blue-600 text-black";
        else if (status === 'correct') className += "text-green-600";
        else if (status === 'incorrect') className += "text-red-600 bg-red-50";
        else className += "text-gray-400";

        // Handle Enter key visualization
        if (char === '\n') {
            return (
                <span key={absoluteIndex} className={className + " w-full block mb-2"}>
                    <span className="opacity-30 text-xs">↵</span>
                </span>
            );
        }

        return <span key={absoluteIndex} className={className}>{char}</span>;
    };

    const renderedContent = (
        <div className="text-2xl font-mono leading-relaxed break-words whitespace-pre-wrap select-none w-full outline-none" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
            {Array.from({ length: endWindow - startWindow }).map((_, i) => {
                const absoluteIndex = startWindow + i;
                const char = content[absoluteIndex % content.length];
                return renderChar(char, i, absoluteIndex);
            })}
        </div>
    );


    return (
        <div className="flex h-screen bg-blue-50 overflow-hidden font-sans">
            {/* LEFT PANE: Content & Keyboard */}
            <div className="flex-1 flex flex-col p-6 gap-6">
                {/* Text Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-blue-100 p-8 flex items-start overflow-hidden relative">
                    {/* We need a better text renderer for the looping content to look stable */}
                    {/* Let's try a simple block that shifts? Or just static text for now? */}
                    {/* User wants "Keep matching". Simple approach: Always show next X chars. */}
                    {renderedContent}
                </div>

                {/* Keyboard Area */}
                <div className="h-1/3 bg-white rounded-xl shadow-sm border border-blue-100 p-4 flex items-center justify-center">
                    <div className="scale-90 origin-bottom">
                        <VirtualKeyboard activeKeys={currentChar ? [currentChar.toLowerCase()] : []} pressedKey={null} />
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
                        <p className="text-4xl font-bold font-mono text-gray-900">{formatTime(timeLeft)}</p>
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
