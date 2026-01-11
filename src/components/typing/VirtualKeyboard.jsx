import React from 'react';

const KEYBOARD_LAYOUT = [
    [
        { key: '`', shift: '~', code: 'Backquote', finger: 'L_Pinky' },
        { key: '1', shift: '!', code: 'Digit1', finger: 'L_Pinky' },
        { key: '2', shift: '@', code: 'Digit2', finger: 'L_Ring' },
        { key: '3', shift: '#', code: 'Digit3', finger: 'L_Middle' },
        { key: '4', shift: '$', code: 'Digit4', finger: 'L_Index' },
        { key: '5', shift: '%', code: 'Digit5', finger: 'L_Index' },
        { key: '6', shift: '^', code: 'Digit6', finger: 'R_Index' },
        { key: '7', shift: '&', code: 'Digit7', finger: 'R_Index' },
        { key: '8', shift: '*', code: 'Digit8', finger: 'R_Middle' },
        { key: '9', shift: '(', code: 'Digit9', finger: 'R_Ring' },
        { key: '0', shift: ')', code: 'Digit0', finger: 'R_Pinky' },
        { key: '-', shift: '_', code: 'Minus', finger: 'R_Pinky' },
        { key: '=', shift: '+', code: 'Equal', finger: 'R_Pinky' },
        { key: 'Back', width: 'w-16', code: 'Backspace', isSpecial: true }
    ],
    [
        { key: 'Tab', width: 'w-14', code: 'Tab', isSpecial: true },
        { key: 'q', code: 'KeyQ', finger: 'L_Pinky' },
        { key: 'w', code: 'KeyW', finger: 'L_Ring' },
        { key: 'e', code: 'KeyE', finger: 'L_Middle' },
        { key: 'r', code: 'KeyR', finger: 'L_Index' },
        { key: 't', code: 'KeyT', finger: 'L_Index' },
        { key: 'y', code: 'KeyY', finger: 'R_Index' },
        { key: 'u', code: 'KeyU', finger: 'R_Index' },
        { key: 'i', code: 'KeyI', finger: 'R_Middle' },
        { key: 'o', code: 'KeyO', finger: 'R_Ring' },
        { key: 'p', code: 'KeyP', finger: 'R_Pinky' },
        { key: '[', shift: '{', code: 'BracketLeft', finger: 'R_Pinky' },
        { key: ']', shift: '}', code: 'BracketRight', finger: 'R_Pinky' },
        { key: '\\', shift: '|', width: 'w-12', code: 'Backslash', finger: 'R_Pinky' }
    ],
    [
        { key: 'Caps', width: 'w-16', code: 'CapsLock', isSpecial: true },
        { key: 'a', code: 'KeyA', finger: 'L_Pinky' },
        { key: 's', code: 'KeyS', finger: 'L_Ring' },
        { key: 'd', code: 'KeyD', finger: 'L_Middle' },
        { key: 'f', code: 'KeyF', finger: 'L_Index' },
        { key: 'g', code: 'KeyG', finger: 'L_Index' },
        { key: 'h', code: 'KeyH', finger: 'R_Index' },
        { key: 'j', code: 'KeyJ', finger: 'R_Index' },
        { key: 'k', code: 'KeyK', finger: 'R_Middle' },
        { key: 'l', code: 'KeyL', finger: 'R_Ring' },
        { key: ';', shift: ':', code: 'Semicolon', finger: 'R_Pinky' },
        { key: "'", shift: '"', code: 'Quote', finger: 'R_Pinky' },
        { key: 'Enter', width: 'flex-1', code: 'Enter', isSpecial: true }
    ],
    [
        { key: 'Shift', width: 'w-20', code: 'ShiftLeft', isSpecial: true },
        { key: 'z', code: 'KeyZ', finger: 'L_Pinky' },
        { key: 'x', code: 'KeyX', finger: 'L_Ring' },
        { key: 'c', code: 'KeyC', finger: 'L_Middle' },
        { key: 'v', code: 'KeyV', finger: 'L_Index' },
        { key: 'b', code: 'KeyB', finger: 'L_Index' },
        { key: 'n', code: 'KeyN', finger: 'R_Index' },
        { key: 'm', code: 'KeyM', finger: 'R_Index' },
        { key: ',', shift: '<', code: 'Comma', finger: 'R_Middle' },
        { key: '.', shift: '>', code: 'Period', finger: 'R_Ring' },
        { key: '/', shift: '?', code: 'Slash', finger: 'R_Pinky' },
        { key: 'Shift', width: 'flex-1', code: 'ShiftRight', isSpecial: true }
    ],
    [
        { key: 'Ctrl', width: 'w-12', code: 'ControlLeft', isSpecial: true },
        { key: 'Win', width: 'w-12', code: 'MetaLeft', isSpecial: true },
        { key: 'Alt', width: 'w-12', code: 'AltLeft', isSpecial: true },
        { key: 'Space', width: 'w-64', code: 'Space', isSpecial: true },
        { key: 'Alt', width: 'w-12', code: 'AltRight', isSpecial: true },
        { key: 'Win', width: 'w-12', code: 'MetaRight', isSpecial: true },
        { key: 'Ctrl', width: 'w-12', code: 'ControlRight', isSpecial: true }
    ]
];

const VirtualKeyboard = ({ activeKeys = [], pressedKey = null, wrongKey = null }) => {

    // Helper to check if key is active
    const isActive = (k) => activeKeys.includes(k.key.toLowerCase()) || activeKeys.includes(k.code);
    const isWrong = (k) => wrongKey === k.key.toLowerCase() || wrongKey === k.code;

    // Finger color mapping
    const getFingerColor = (finger) => {
        if (!finger) return 'bg-white';
        if (finger.includes('Pinky')) return 'bg-blue-100 border-blue-200';
        if (finger.includes('Ring')) return 'bg-red-100 border-red-200';
        if (finger.includes('Middle')) return 'bg-green-100 border-green-200';
        if (finger.includes('Index')) return 'bg-purple-100 border-purple-200';
        return 'bg-white'; // Default / Thumbs
    };

    const getKeyStyle = (k) => {
        const isTarget = isActive(k);
        const isWrongKey = isWrong(k);
        const isPressed = pressedKey === k.key || pressedKey === k.code;

        // Base style
        let style = "h-12 m-0.5 rounded shadow flex items-center justify-center font-bold text-lg transition-all relative ";

        if (k.width) style += k.width + " ";
        else style += "w-12 ";

        if (isWrongKey) {
            style += "bg-red-500 text-white border-red-700 "; // Error state
        } else if (isTarget) {
            // Target key - Use strong finger color
            if (k.finger && k.finger.includes('Pinky')) style += "bg-blue-500 text-white border-blue-700 ";
            else if (k.finger && k.finger.includes('Ring')) style += "bg-red-500 text-white border-red-700 ";
            else if (k.finger && k.finger.includes('Middle')) style += "bg-green-500 text-white border-green-700 ";
            else if (k.finger && k.finger.includes('Index')) style += "bg-purple-500 text-white border-purple-700 ";
            else style += "bg-blue-500 text-white border-blue-700 "; // Fallback
        } else if (isPressed) {
            style += "bg-gray-300 translate-y-0.5 shadow-none ";
        } else {
            // Default styling with subtle finger hints
            style += `${getFingerColor(k.finger)} border-b-4 text-gray-700 `;
        }

        return style;
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-100 shadow-inner border border-slate-200">
            <div className="flex flex-col gap-1">
                {KEYBOARD_LAYOUT.map((row, i) => (
                    <div key={i} className="flex justify-center w-full gap-1">
                        {row.map((k, j) => (
                            <div key={j} className={getKeyStyle(k)}>
                                {k.key === 'Space' ? '' : k.key}
                                {k.shift && <span className="absolute text-xs top-1 left-1 opacity-60 font-normal">{k.shift}</span>}
                                {isWrong(k) && (
                                    <div className="absolute inset-0 flex items-center justify-center text-red-900 opacity-50 text-4xl font-bold select-none overflow-hidden">
                                        /
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VirtualKeyboard;
