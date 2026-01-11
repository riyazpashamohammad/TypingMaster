import React from 'react';

const HandsOverlay = ({ activeFinger, activeFingers = [] }) => {
    // improved SVG representation of hands

    // Helper to determine if a specific finger is active
    const isActive = (side, fingerName) => {
        const id = `${side}_${fingerName}`;
        return activeFinger === id || activeFingers.includes(id);
    };

    const FingerShape = ({ x, y, width, height, rotate, side, name, activeColor }) => {
        const active = isActive(side, name);
        const fill = active ? `url(#grad-${side}-${name})` : "url(#skin-gradient)";
        const stroke = active ? activeColor : "#d4a373";

        return (
            <g transform={`translate(${x}, ${y}) rotate(${rotate})`}>
                <defs>
                    <radialGradient id={`grad-${side}-${name}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor={activeColor} stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#e5bb95" stopOpacity="1" />
                    </radialGradient>
                </defs>
                {/* Finger Glow if active */}
                {active && <rect x={-width / 2 - 4} y={-4} width={width + 8} height={height + 8} rx={width / 2} fill={activeColor} filter="url(#glow)" opacity="0.4" />}

                {/* Finger Body */}
                <rect x={-width / 2} y={0} width={width} height={height} rx={width / 2} fill={fill} stroke={stroke} strokeWidth="1" />

                {/* Dot Indicator on Fingertip */}
                {active && (
                    <circle cx={0} cy={height * 0.15} r={5} fill="black" stroke="white" strokeWidth="2" className="animate-pulse" />
                )}
            </g>
        );
    };

    return (
        <div className="flex justify-center mt-8 scale-110">
            <svg width="500" height="220" viewBox="0 0 500 220" className="drop-shadow-xl">
                <defs>
                    <linearGradient id="skin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f5d0a9" />
                        <stop offset="100%" stopColor="#e5bb95" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Left Hand Group */}
                <g transform="translate(140, 60)">
                    {/* Palm Base */}
                    <path d="M -50 80 Q -60 140 10 150 Q 70 140 60 80 Z" fill="url(#skin-gradient)" stroke="#d4a373" />

                    {/* Fingers (Fan out) */}
                    <FingerShape side="L" name="Pinky" x={-55} y={15} width={22} height={70} rotate={-15} activeColor="#60a5fa" />
                    <FingerShape side="L" name="Ring" x={-25} y={-15} width={24} height={95} rotate={-5} activeColor="#f87171" />
                    <FingerShape side="L" name="Middle" x={10} y={-25} width={25} height={105} rotate={2} activeColor="#4ade80" />
                    <FingerShape side="L" name="Index" x={45} y={-10} width={25} height={90} rotate={10} activeColor="#c084fc" />
                    {/* Thumb */}
                    <g transform="translate(75, 50) rotate(35)">
                        <FingerShape side="L" name="Thumb" x={0} y={0} width={28} height={60} rotate={0} activeColor="#9ca3af" />
                    </g>
                </g>

                {/* Right Hand Group */}
                <g transform="translate(360, 60)">
                    {/* Palm Base */}
                    <path d="M 50 80 Q 60 140 -10 150 Q -70 140 -60 80 Z" fill="url(#skin-gradient)" stroke="#d4a373" />

                    {/* Fingers (Fan out - mirrored) */}
                    <FingerShape side="R" name="Pinky" x={55} y={15} width={22} height={70} rotate={15} activeColor="#60a5fa" />
                    <FingerShape side="R" name="Ring" x={25} y={-15} width={24} height={95} rotate={5} activeColor="#f87171" />
                    <FingerShape side="R" name="Middle" x={-10} y={-25} width={25} height={105} rotate={-2} activeColor="#4ade80" />
                    <FingerShape side="R" name="Index" x={-45} y={-10} width={25} height={90} rotate={-10} activeColor="#c084fc" />
                    {/* Thumb */}
                    <g transform="translate(-75, 50) rotate(-35)">
                        <FingerShape side="R" name="Thumb" x={0} y={0} width={28} height={60} rotate={0} activeColor="#9ca3af" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default HandsOverlay;
