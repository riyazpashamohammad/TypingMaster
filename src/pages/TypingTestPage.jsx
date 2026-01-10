import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { RefreshCcw, Clock } from 'lucide-react';

const TEXTS = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.",
    "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. I have not failed. I've just found 10,000 ways that won't work."
];

const TypingTestPage = () => {
    const [selectedText, setSelectedText] = useState(TEXTS[0]);
    const [duration, setDuration] = useState(60); // 1 minute default
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);

    // Typing Engine
    const engine = useTypingEngine(selectedText);

    // Handle Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (engine.isFinished || timeLeft === 0) return;

            if (!isActive && e.key.length === 1) {
                setIsActive(true);
            }

            if (e.key === 'Backspace') {
                // Engine doesn't support backspace yet perfectly for drilled, but for test we might want it.
                // For now, simplicity: Engine is forward only
            }

            engine.handleKeyPress(e.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engine, isActive, timeLeft]);

    // Timer
    useEffect(() => {
        let interval;
        if (isActive && timeLeft > 0 && !engine.isFinished) {
            interval = setInterval(() => {
                setTimeLeft(curr => curr - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, engine.isFinished]);

    const handleRestart = () => {
        engine.reset();
        setTimeLeft(duration);
        setIsActive(false);
        const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
        setSelectedText(randomText);
        // Note: useTypingEngine doesn't auto-update targetText if changed dynamically unless keys change or we recreate.
        // But hook uses `targetText` in dependency array effectively if we pass it. 
        // Our hook logic: `const totalChars = targetText.length`. Updating targetText updates this.
    };

    return (
        <AppLayout>
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-900 mb-8">Typing Test</h1>

                <div className="bg-white p-6 rounded-xl shadow-lg border">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <select
                                className="p-2 border rounded"
                                value={duration}
                                onChange={(e) => { setDuration(Number(e.target.value)); setTimeLeft(Number(e.target.value)); }}
                                disabled={isActive}
                            >
                                <option value={60}>1 Minute</option>
                                <option value={120}>2 Minutes</option>
                                <option value={300}>5 Minutes</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 text-xl font-mono font-bold text-blue-600">
                            <Clock /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        <button onClick={handleRestart} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600">
                            <RefreshCcw size={18} /> Restart
                        </button>
                    </div>

                    {/* Results Overlay */}
                    {(timeLeft === 0 || engine.isFinished) ? (
                        <div className="mb-6 p-6 bg-blue-50 rounded-lg flex justify-around text-center">
                            <div>
                                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Speed</p>
                                <p className="text-4xl font-bold text-blue-600">{engine.wpm} <span className="text-lg text-gray-400">wpm</span></p>
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Accuracy</p>
                                <p className="text-4xl font-bold text-green-600">{engine.accuracy}%</p>
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Net Speed</p>
                                <p className="text-4xl font-bold text-blue-800">{Math.round(engine.wpm * (engine.accuracy / 100))} <span className="text-lg text-gray-400">wpm</span></p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-gray-50 rounded text-center text-gray-500">
                            {!isActive ? "Start typing to begin..." : "Keep going!"}
                        </div>
                    )}

                    {/* Text Display */}
                    <div className="p-6 border rounded-lg bg-gray-50 text-xl font-mono leading-relaxed relative min-h-[200px] select-none" onClick={() => document.body.focus()}>
                        {/* We can use a similar rendering strategy as DrillScreen or just plain text with overlay */}
                        {/* For test, simpler rendering often better */}
                        <div className="whitespace-pre-wrap break-words">
                            {selectedText.split('').map((char, index) => {
                                let color = 'text-gray-400';
                                let bg = 'transparent';

                                if (index < engine.cursor) {
                                    const typed = engine.typedChars[index];
                                    if (typed === char) {
                                        color = 'text-green-600';
                                    } else {
                                        color = 'text-red-600';
                                        bg = 'bg-red-100';
                                    }
                                } else if (index === engine.cursor) {
                                    bg = 'bg-blue-200 border-b-2 border-blue-600';
                                    color = 'text-black';
                                }

                                return <span key={index} className={`${color} ${bg}`}>{char}</span>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TypingTestPage;
