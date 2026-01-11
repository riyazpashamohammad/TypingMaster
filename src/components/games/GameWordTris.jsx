import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Target, Zap } from 'lucide-react';
import { getRandomWord } from '../../utils/gameWords';

const GameCosmicDefense = ({ onClose }) => {
    const [enemies, setEnemies] = useState([]);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [typed, setTyped] = useState("");
    const [gameState, setGameState] = useState('start');
    const [spawnRate, setSpawnRate] = useState(2000);
    const [enemySpeed, setEnemySpeed] = useState(0.2); // Movement factor

    const requestRef = useRef();
    const spawnTimerRef = useRef();
    const containerRef = useRef(null);
    const BASE_HEALTH = 100;
    const [health, setHealth] = useState(BASE_HEALTH);

    // Initial Setup
    const startGame = () => {
        setEnemies([]);
        setScore(0);
        setLevel(1);
        setTyped("");
        setHealth(BASE_HEALTH);
        setGameState('playing');
        setEnemySpeed(0.2);
        setSpawnRate(2000);
    };

    // Spawn Logic
    useEffect(() => {
        if (gameState !== 'playing') return;

        const spawn = () => {
            const angle = Math.random() * 2 * Math.PI;
            const distance = 500; // Start far out
            // Convert polar to cartesian relative to center (0,0) being center screen
            // We'll store distance and angle to make movement towards center easy
            // Actually, simple x/y updates towards 0,0 is easiest

            setEnemies(prev => [...prev, {
                id: Date.now(),
                word: getRandomWord(score > 100 ? 'hard' : 'medium'),
                angle,
                distance: 50, // Percent from center? Let's say 50% is edge of circle
                // Let's use 0-100 scale where 0 is center. Start at 60 (offscreen-ish depends on aspect)
                distanceToCenter: 60,
                color: ['#f472b6', '#22d3ee', '#a78bfa', '#fbbf24'][Math.floor(Math.random() * 4)]
            }]);

            let nextSpawn = spawnRate;
            if (score > 200) nextSpawn *= 0.9;
            if (score > 500) nextSpawn *= 0.9;

            spawnTimerRef.current = setTimeout(spawn, nextSpawn);
        };

        spawn();
        return () => clearTimeout(spawnTimerRef.current);
    }, [gameState, spawnRate, score]);

    // Game Loop
    const animate = () => {
        if (gameState !== 'playing') return;

        setEnemies(prev => {
            let gameOver = false;
            let dmg = 0;

            const next = prev.map(e => ({
                ...e,
                distanceToCenter: e.distanceToCenter - (enemySpeed * (1 + level * 0.1))
            })).filter(e => {
                if (e.distanceToCenter <= 0) {
                    dmg += 20;
                    return false; // Remove enemy
                }
                return true;
            });

            if (dmg > 0) {
                setHealth(h => {
                    const newH = h - dmg;
                    if (newH <= 0) gameOver = true;
                    return newH;
                });
            }

            if (gameOver) {
                setGameState('gameover');
            }

            return next;
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, enemySpeed, level]);

    // Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== 'playing') return;
            const char = e.key;
            if (char.length !== 1) return;

            setTyped(prev => {
                const nextTyped = prev + char;
                // Auto-target closest matching string?
                // Or just any matching string.

                const matches = enemies.filter(e => e.word.startsWith(nextTyped));

                if (matches.length > 0) {
                    // Filter match
                    const exact = matches.find(e => e.word === nextTyped);
                    if (exact) {
                        // Destroy
                        setEnemies(curr => curr.filter(x => x.id !== exact.id));
                        setScore(s => s + 50);
                        return "";
                    }
                    return nextTyped;
                }
                return ""; // Reset on fail
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enemies, gameState]);


    return (
        <div className="fixed inset-0 bg-black z-50 overflow-hidden flex flex-col font-mono">
            {/* Starfield bg effect could go here */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* HUD */}
            <div className="flex justify-between p-6 text-white z-10 pointer-events-none">
                <div className="flex gap-8">
                    <div>
                        <div className="text-xs text-purple-400">DEFENSE SCORE</div>
                        <div className="text-3xl font-bold font-mono tracking-widest text-shadow-glow">{score.toString().padStart(6, '0')}</div>
                    </div>
                </div>
                <button onClick={onClose} className="pointer-events-auto p-2 hover:bg-white/10 rounded-full"><X /></button>
            </div>

            {/* Center Base */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.5)] flex items-center justify-center">
                        <Target className="text-white animate-spin-slow" size={32} />
                    </div>
                    {/* Health Ring */}
                    <svg className="absolute -top-2 -left-2 w-20 h-20 rotate-[-90deg]">
                        <circle cx="40" cy="40" r="38" stroke="transparent" strokeWidth="4" fill="none" />
                        <circle
                            cx="40" cy="40" r="38"
                            stroke={health > 30 ? "#4ade80" : "#ef4444"}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="238"
                            strokeDashoffset={238 - (238 * health / 100)}
                            className="transition-all duration-300"
                        />
                    </svg>
                </div>
            </div>

            {/* Game Field */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {enemies.map(e => {
                    // Convert Polar (distance, angle) to Cartesian percents centered at 50,50
                    // distance 0 to 60. 
                    // x = 50 + cos(a)*d
                    // y = 50 + sin(a)*d * aspect_ratio_correction? 
                    // Simplification: assume square field effectively for gameplay
                    const x = 50 + Math.cos(e.angle) * e.distanceToCenter;
                    const y = 50 + Math.sin(e.angle) * e.distanceToCenter;

                    return (
                        <div
                            key={e.id}
                            className="absolute flex items-center justify-center transition-transform duration-100"
                            style={{
                                left: `${x}%`, top: `${y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div
                                className="px-3 py-1 rounded bg-gray-900/80 border border-white/20 text-sm font-bold tracking-wider backdrop-blur-md shadow-2xl flex items-center gap-2"
                                style={{ boxShadow: `0 0 15px ${e.color}` }}
                            >
                                <span style={{ color: e.color }}><Zap size={12} fill="currentColor" /></span>
                                <span className="text-gray-400">
                                    <span className="text-white text-shadow-glow">
                                        {typed && e.word.startsWith(typed) ? typed : ""}
                                    </span>
                                    {typed && e.word.startsWith(typed) ? e.word.slice(typed.length) : e.word}
                                </span>
                            </div>
                            {/* Line to center for visual effect */}
                            <div
                                className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-transparent to-blue-500/50 origin-left -z-10"
                                style={{
                                    width: '100px', // Just a tail
                                    transform: `rotate(${e.angle + Math.PI}rad)`
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Screens */}
            {gameState !== 'playing' && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                    <div className="text-center">
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-tighter">COSMIC DEFENSE</h1>
                        {gameState === 'gameover' && <div className="text-4xl text-white font-mono mb-8">SCORE: {score}</div>}
                        <button
                            onClick={startGame}
                            className="bg-whitetext-black px-12 py-4 rounded-full font-bold text-xl hover:scale-110 transition-transform bg-white text-black"
                        >
                            {gameState === 'start' ? 'INITIATE DEFENSE' : 'RETRY MISSION'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameCosmicDefense;
