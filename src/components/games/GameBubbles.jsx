import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const WORDS = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", "watermelon"];

const GameBubbles = ({ onClose }) => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [typed, setTyped] = useState("");
    const [gameOver, setGameOver] = useState(false);

    const requestRef = useRef();
    const frameCount = useRef(0);
    const containerRef = useRef(null);

    // Spawn bubbles
    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            const word = WORDS[Math.floor(Math.random() * WORDS.length)];
            const left = Math.random() * 80 + 10; // 10% to 90%
            setBubbles(prev => [...prev, { id: Date.now(), word, x: left, y: 100 }]);
        }, 2000);
        return () => clearInterval(interval);
    }, [gameOver]);

    // Game Loop (Animation)
    const animate = () => {
        if (gameOver) return;

        setBubbles(prev => {
            const nextBubbles = prev.map(b => ({ ...b, y: b.y - 0.2 })).filter(b => {
                if (b.y < 0) {
                    setLives(l => {
                        if (l <= 1) setGameOver(true);
                        return l - 1;
                    });
                    return false; // Remove bubble
                }
                return true;
            });
            return nextBubbles;
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameOver]);

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver) return;
            const char = e.key;
            if (char.length !== 1) return;

            setTyped(prev => {
                const nextTyped = prev + char;
                // Check if any bubble starts with this
                const matchingBubble = bubbles.find(b => b.word.startsWith(nextTyped));

                if (matchingBubble) {
                    if (matchingBubble.word === nextTyped) {
                        // Pop!
                        setBubbles(curr => curr.filter(b => b.id !== matchingBubble.id));
                        setScore(s => s + 10);
                        return "";
                    }
                    return nextTyped;
                } else {
                    // Reset if no match
                    // Or keep if it matches another bubble? 
                    // Simple logic: Reset if invalid chain
                    return ""; // Punish by clearing? Or strict typing?
                }
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [bubbles, gameOver]);

    return (
        <div className="fixed inset-0 bg-blue-900 z-50 overflow-hidden flex flex-col">
            <div className="flex justify-between p-4 text-white z-10">
                <div className="text-2xl font-bold">Score: {score}</div>
                <div className="text-xl">Lives: {'♥'.repeat(lives)}</div>
                <button onClick={onClose}><X /></button>
            </div>

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white z-20">
                    <h2 className="text-5xl font-bold mb-4">Game Over</h2>
                    <p className="text-2xl mb-8">Final Score: {score}</p>
                    <button onClick={onClose} className="px-8 py-3 bg-blue-600 rounded-full text-xl hover:bg-blue-700">Close</button>
                </div>
            )}

            <div className="flex-1 relative" ref={containerRef}>
                {bubbles.map(b => (
                    <div
                        key={b.id}
                        className="absolute flex items-center justify-center w-24 h-24 rounded-full bg-blue-400/80 border-2 border-white/50 text-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-transform"
                        style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    >
                        {/* Highlight matched part */}
                        <span>
                            <span className="text-yellow-300">{typed && b.word.startsWith(typed) ? typed : ""}</span>
                            {typed && b.word.startsWith(typed) ? b.word.slice(typed.length) : b.word}
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-4 text-center text-white/50">Type the words to pop bubbles!</div>
        </div>
    );
};

export default GameBubbles;
