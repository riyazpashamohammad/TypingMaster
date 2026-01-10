import React from 'react';

const HandsOverlay = ({ activeFinger }) => {
    // Simple SVG representation of hands
    // activeFinger e.g., 'L_Index'

    const FINGER_MAP = {
        'L_Pinky': { cx: 30, cy: 50, color: 'blue-500' },
        'L_Ring': { cx: 60, cy: 30, color: 'red-500' },
        'L_Middle': { cx: 90, cy: 20, color: 'green-500' },
        'L_Index': { cx: 120, cy: 30, color: 'purple-500' },
        'L_Thumb': { cx: 150, cy: 70, color: 'gray-400' },

        'R_Thumb': { cx: 250, cy: 70, color: 'gray-400' },
        'R_Index': { cx: 280, cy: 30, color: 'purple-500' },
        'R_Middle': { cx: 310, cy: 20, color: 'green-500' },
        'R_Ring': { cx: 340, cy: 30, color: 'red-500' },
        'R_Pinky': { cx: 370, cy: 50, color: 'blue-500' },
    };

    return (
        <div className="flex justify-center mt-4">
            <svg width="400" height="150" viewBox="0 0 400 150" className="opacity-90">
                {/* Left Hand */}
                <path d="M 20 100 Q 10 70 30 50 L 30 100" fill="transparent" stroke="none" />
                {/* Simplified Shapes for fingers */}
                <g id="LeftHand" fill="#e5bb95">
                    <rect x="20" y="50" width="20" height="80" rx="10" /> {/* Pinky */}
                    <rect x="50" y="30" width="20" height="100" rx="10" /> {/* Ring */}
                    <rect x="80" y="20" width="20" height="110" rx="10" /> {/* Middle */}
                    <rect x="110" y="30" width="20" height="100" rx="10" /> {/* Index */}
                    <ellipse cx="150" cy="80" rx="20" ry="30" /> {/* Thumb */}
                    <rect x="40" y="90" width="100" height="60" rx="10" /> {/* Palm */}
                </g>

                <g id="RightHand" fill="#e5bb95">
                    <rect x="360" y="50" width="20" height="80" rx="10" /> {/* Pinky */}
                    <rect x="330" y="30" width="20" height="100" rx="10" /> {/* Ring */}
                    <rect x="300" y="20" width="20" height="110" rx="10" /> {/* Middle */}
                    <rect x="270" y="30" width="20" height="100" rx="10" /> {/* Index */}
                    <ellipse cx="250" cy="80" rx="20" ry="30" /> {/* Thumb */}
                    <rect x="260" y="90" width="100" height="60" rx="10" /> {/* Palm */}
                </g>

                {/* Highlight Dots */}
                {Object.entries(FINGER_MAP).map(([finger, data]) => {
                    const isActive = activeFinger === finger;
                    return (
                        <circle
                            key={finger}
                            cx={data.cx}
                            cy={data.cy}
                            r={isActive ? 8 : 6}
                            className={`transition-all duration-300 ${isActive ? `fill-${data.color} stroke-white stroke-2` : 'fill-blue-300 opacity-50'}`}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default HandsOverlay;
