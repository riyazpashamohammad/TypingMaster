import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LESSONS } from '../core/lessonData';
import DrillScreen from '../components/typing/DrillScreen';
import { Play, CheckCircle, Circle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AppLayout from '../components/layout/AppLayout';

const LessonPage = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const { progress } = useUser();
    const [activeSectionIndex, setActiveSectionIndex] = useState(null);

    const lesson = LESSONS.find(l => l.id === parseInt(lessonId));

    if (!lesson) return <div>Lesson not found</div>;

    const sections = lesson.sections;

    const handleStartSection = (index) => {
        setActiveSectionIndex(index);
    };

    const handleCompleteSection = () => {
        if (activeSectionIndex < sections.length - 1) {
            setActiveSectionIndex(prev => prev + 1);
        } else {
            setActiveSectionIndex(null); // Finished lesson
        }
    };

    const handleCloseDrill = () => {
        setActiveSectionIndex(null);
    };

    // If drill is active, show DrillScreen (Full coverage)
    if (activeSectionIndex !== null) {
        return (
            <DrillScreen
                section={sections[activeSectionIndex]}
                onComplete={handleCompleteSection}
                onClose={handleCloseDrill}
            />
        );
    }

    return (
        <AppLayout>
            <div className="p-8 max-w-5xl mx-auto">
                <button onClick={() => navigate('/study')} className="mb-4 text-blue-600 hover:underline">Back to Course</button>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
                <p className="text-gray-600 mb-8">{lesson.description}</p>

                <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b flex justify-between items-center">
                        <h2 className="font-semibold text-blue-900">Lesson Curriculum</h2>
                        <span className="text-sm text-gray-500">{sections.length} exercises</span>
                    </div>
                    <div>
                        {sections.map((section, index) => {
                            // Check if completed
                            // const isCompleted = progress[lesson.id]?.[section.id]; 
                            // Simplification:
                            const isCompleted = false;

                            return (
                                <div key={section.id} className="p-4 border-b last:border-0 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        {isCompleted ? <CheckCircle className="text-green-500" size={24} /> : <Circle className="text-gray-300" size={24} />}
                                        <div>
                                            <p className="font-medium text-gray-800 group-hover:text-blue-600">{section.id} {section.title}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">{section.type.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-400">{section.duration}</span>
                                        <button
                                            onClick={() => handleStartSection(index)}
                                            className="px-4 py-2 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-blue-700"
                                        >
                                            <Play size={16} fill="currentColor" /> Start
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default LessonPage;
