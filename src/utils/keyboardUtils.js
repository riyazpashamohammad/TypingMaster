
const FULL_LAYOUT = [
    // Flat list of keys for lookup
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
    { key: '\\', shift: '|', code: 'Backslash', finger: 'R_Pinky' },

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

    { key: ' ', code: 'Space', finger: 'L_Thumb' }, // thumb
];

export const getFingerForChar = (char) => {
    if (!char) return null;
    if (char === ' ') return 'L_Thumb'; // or R_Thumb, context dependent, defaulting Left
    const lowerChar = char.toLowerCase();

    const mapping = FULL_LAYOUT.find(m => m.key === lowerChar || m.shift === char);
    if (mapping) return mapping.finger;

    // Fallback for upper case if not found in shift
    const mapping2 = FULL_LAYOUT.find(m => m.key === lowerChar);
    return mapping2 ? mapping2.finger : null;
};
