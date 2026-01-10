import React, { useEffect, useState } from 'react';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import VirtualKeyboard from './VirtualKeyboard';
import HandsOverlay from './HandsOverlay';
import { getFingerForChar } from '../../utils/keyboardUtils';
import { useUser } from '../../context/UserContext';
import { X } from 'lucide-react';

const DrillScreen = ({ section, onComplete, onClose }) => {
    // section: { id, title, type, content, keys? }
    const engine = useTypingEngine(section.content || " "); // Default space for info slides
    const [started, setStarted] = useState(false);
    const { saveLessonProgress } = useUser();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (section.type === 'info' || section.type === 'new_keys') {
                if (e.key === ' ') {
                    onComplete();
                }
                return;
            }

            // Prevent default for special keys to avoid scrolling
            if (e.key === ' ' || e.key.length === 1) {
                // e.preventDefault(); 
            }
            engine.handleKeyPress(e.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engine, onComplete, section.type]);

    useEffect(() => {
        if (engine.isFinished && section.type === 'drill') {
            saveLessonProgress(section.id.split('.')[0], section.id, { wpm: engine.wpm, accuracy: engine.accuracy });
            // Small delay to show result?
            setTimeout(() => onComplete(), 500);
        }
    }, [engine.isFinished, onComplete, section.id, engine.wpm, engine.accuracy, saveLessonProgress, section.type]);

    // Determine active content
    const currentChar = section.type === 'drill' ? section.content[engine.cursor] : null;
    const activeFinger = getFingerForChar(currentChar);

    // Info Screen / New Keys Logic
    if (section.type === 'info' || section.type === 'new_keys') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100"><X /></button>

                <h2 className="text-3xl font-bold text-blue-800 mb-8">{section.title}</h2>
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-2xl">
                    <p className="text-xl mb-6">
                        {section.type === 'new_keys' ? `New Keys: ${section.keys.join(', ').toUpperCase()}` : "Welcome to the lesson."}
                    </p>
                    <p className="text-gray-500 mb-8">Press SPACE to continue</p>

                    <VirtualKeyboard activeKeys={section.keys || []} />
                    <HandsOverlay activeFinger={null} />
                </div>
            </div>
        );
    }

    // Drill Screen
    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
                <h2 className="text-xl font-bold">{section.title}</h2>
                <div className="flex gap-4 text-sm font-medium">
                    <span className="text-gray-600">Progress: {Math.round((engine.cursor / section.content.length) * 100)}%</span>
                    <span className="text-blue-600">WPM: {engine.wpm}</span>
                    <span className={`text-${engine.accuracy > 90 ? 'green' : 'red'}-600`}>Accuracy: {engine.accuracy}%</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            {/* Text Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md mb-8 text-2xl font-mono leading-relaxed break-words whitespace-pre-wrap">
                    <span className="text-green-600 border-b-2 border-transparent">{engine.typedChars}</span>
                    <span className="bg-blue-200 border-b-2 border-blue-600">{currentChar}</span>
                    <span className="text-gray-300">{section.content.slice(engine.cursor + 1)}</span>
                </div>

                {/* Visuals */}
                <div className="mt-auto mb-8">
                    <VirtualKeyboard activeKeys={currentChar ? [currentChar.toLowerCase()] : []} pressedKey={null} />
                    <HandsOverlay activeFinger={activeFinger} />
                </div>
            </div>
        </div>
    );
};

export default DrillScreen;
