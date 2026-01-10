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

const VirtualKeyboard = ({ activeKeys = [], pressedKey = null }) => {

    // Helper to check if key is active
    const isActive = (k) => activeKeys.includes(k.key.toLowerCase()) || activeKeys.includes(k.code);

    // Determine color based on active
    // Standard key: bg-white or bg-slate-100
    // Active key: bg-green-500 text-white (as per screenshot which has green/red/blue/purple)
    // Actually screenshot shows colored keys based on FINGER mapping.
    // L_Pinky: Blue, L_Ring: Red, L_Middle: Green, L_Index: Purple?
    // Let's implement roughly that coloring if "ShowHelp" is on, OR just highlight active key.
    // For now, I'll just highlight the ACTIVE target key in Green or Blue.

    const getKeyStyle = (k) => {
        const isTarget = isActive(k);
        const isPressed = pressedKey === k.key || pressedKey === k.code;

        // Base style
        let style = "h-10 m-0.5 rounded shadow flex items-center justify-center font-medium text-sm transition-all ";

        if (k.width) style += k.width + " ";
        else style += "w-10 ";

        if (isTarget) {
            style += "bg-blue-500 text-white translate-y-0.5 shadow-none "; // Highlight active target
        } else if (isPressed) {
            style += "bg-gray-300 translate-y-0.5 shadow-none ";
        } else {
            style += "bg-white border-b-2 border-gray-200 text-gray-700 ";
        }

        return style;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50">
            <div className="flex flex-col">
                {KEYBOARD_LAYOUT.map((row, i) => (
                    <div key={i} className="flex justify-center w-full">
                        {row.map((k, j) => (
                            <div key={j} className={getKeyStyle(k)}>
                                {k.key === 'Space' ? '' : k.key}
                                {k.shift && <span className="absolute text-xs top-1 left-1 opacity-60">{k.shift}</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VirtualKeyboard;
