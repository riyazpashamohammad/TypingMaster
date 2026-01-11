import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Zap } from 'lucide-react';
import { getRandomWord } from '../../utils/gameWords';

const GameNeonRunner = ({ onClose }) => {
    const [obstacles, setObstacles] = useState([]);
    const [score, setScore] = useState(0);
    const [typed, setTyped] = useState("");
    const [gameState, setGameState] = useState('start');
    const [speed, setSpeed] = useState(0.5); // % per frame

    const requestRef = useRef();
    const containerRef = useRef(null);
    const playerX = 15; // Player fixed at 15%

    // Setup
    const startGame = () => {
        setObstacles([]);
        setScore(0);
        setTyped("");
        setGameState('playing');
        setSpeed(0.3);
        // Initial spawn
        spawnObstacle(100);
        spawnObstacle(140);
        spawnObstacle(180);
    };

    const spawnObstacle = (startPos) => {
        setObstacles(prev => [...prev, {
            id: Date.now() + Math.random(),
            word: getRandomWord('easy'),
            x: startPos,
            type: Math.random() > 0.5 ? 'wall' : 'drone'
        }]);
    };

    // Loop
    const animate = () => {
        if (gameState !== 'playing') return;

        setObstacles(prev => {
            let gameOver = false;
            let lastX = 0;

            const next = prev.map(o => ({ ...o, x: o.x - speed }));

            // Check collision
            for (const o of next) {
                if (o.x < playerX + 5) { // Hit player (who is wide approx 5%)
                    gameOver = true;
                }
                lastX = Math.max(lastX, o.x);
            }

            if (gameOver) {
                setGameState('gameover');
                return prev;
            }

            // Spawn new if needed
            if (lastX < 150) { // Keep buffer ahead
                // We can't set state inside setObstacles callback easily for side effects?
                // Actually we can just return new array with added item?
                // Better to use a separate effect or just push here if we are careful.
                // Pure function preferred. Let's filter first.
            }

            return next;
        });

        // Handle spawning outside map
        // We need 'lastX' from the state. 
        // Let's do a separate check or just random spawning interval?
        // Runner usually has fixed distance gaps.

        requestRef.current = requestAnimationFrame(animate);
    };

    // Separate effect for spawning to keep loop clean
    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => {
            setObstacles(prev => {
                const last = prev[prev.length - 1];
                if (!last || last.x < 120) {
                    return [...prev, {
                        id: Date.now(),
                        word: getRandomWord(score > 50 ? 'medium' : 'easy'),
                        x: 150 + Math.random() * 20,
                        type: Math.random() > 0.5 ? 'wall' : 'drone'
                    }];
                }
                return prev;
            });
            // Speed up
            setSpeed(s => Math.min(s + 0.0001, 1.5));
        }, 500);
        return () => clearInterval(interval);
    }, [gameState, score]);


    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, speed]);


    // Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== 'playing') return;
            const char = e.key;
            if (char.length !== 1) return;

            setTyped(prev => {
                const nextTyped = prev + char;
                // Target the closest obstacle (lowest x > playerX)
                const sorted = [...obstacles].sort((a, b) => a.x - b.x);
                const target = sorted[0];

                if (target && target.word.startsWith(nextTyped)) {
                    if (target.word === nextTyped) {
                        // Destroy
                        setObstacles(curr => curr.filter(o => o.id !== target.id));
                        setScore(s => s + 1);
                        return "";
                    }
                    return nextTyped;
                }
                return ""; // punish miss?
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [obstacles, gameState]);

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden font-sans select-none">
            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-purple-900 via-gray-900 to-black">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(transparent 95%, #0ea5e9 95%),
                                           linear-gradient(90deg, transparent 95%, #a855f7 95%)`,
                        backgroundSize: '40px 40px',
                        transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
                        opacity: 0.3
                    }}>
                </div>
            </div>

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between z-10 text-white">
                <div className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                    {Math.floor(score * 10)}m
                </div>
                <button onClick={onClose}><X className="text-white hover:text-pink-500 transition-colors" /></button>
            </div>

            {/* Game Lane */}
            <div className="absolute top-1/2 left-0 right-0 h-64 -translate-y-1/2 bg-white/5 border-y border-white/10 backdrop-blur-sm z-0"></div>

            {/* Player */}
            <div
                className="absolute top-1/2 rounded-lg bg-cyan-500 shadow-[0_0_30px_#06b6d4] z-10 transition-transform"
                style={{
                    left: `${playerX}%`,
                    width: '60px', height: '60px',
                    transform: 'translate(-50%, -50%) skewX(-10deg)'
                }}
            >
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-cyan-400 blur-md"></div>
            </div>

            {/* Obstacles */}
            {obstacles.map(o => (
                <div
                    key={o.id}
                    className="absolute top-1/2 flex flex-col items-center justify-center transition-all duration-100 z-10"
                    style={{ left: `${o.x}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className={`
                        w-16 h-24 mb-4 border-2 flex items-center justify-center relative
                        ${o.type === 'drone' ? 'rounded-full border-pink-500 bg-pink-500/10' : 'rounded-none border-yellow-500 bg-yellow-500/10'}
                        shadow-[0_0_20px_currentColor]
                    `}>
                        <Zap size={32} className={`${o.type === 'drone' ? 'text-pink-500' : 'text-yellow-500'} animate-pulse`} />
                    </div>

                    <div className="bg-black/80 px-3 py-1 rounded text-lg font-bold font-mono border border-white/20 whitespace-nowrap">
                        <span className="text-green-400">{typed && o.word.startsWith(typed) ? typed : ""}</span>
                        <span className="text-white">{typed && o.word.startsWith(typed) ? o.word.slice(typed.length) : o.word}</span>
                    </div>
                </div>
            ))}

            {/* Screens */}
            {gameState !== 'playing' && (
                <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-2 italic">NEON RUNNER</h1>
                    <p className="text-gray-400 mb-12 tracking-widest uppercase">High Velocity Typing</p>

                    {gameState === 'gameover' && (
                        <div className="text-white text-2xl mb-8">DISTANCE: {Math.floor(score * 10)}m</div>
                    )}

                    <button
                        onClick={startGame}
                        className="px-12 py-4 bg-white text-black font-black text-xl hover:bg-cyan-400 transition-colors uppercase skew-x-[-10deg]"
                    >
                        {gameState === 'start' ? 'Start Run' : 'Retry'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameNeonRunner;
