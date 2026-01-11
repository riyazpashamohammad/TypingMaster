import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LESSONS } from '../core/lessonData';
import DrillScreen from '../components/typing/DrillScreen';
import { Play, CheckCircle, Circle, BarChart2, RotateCcw, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AppLayout from '../components/layout/AppLayout';

const LessonPage = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const { progress } = useUser();
    const [activeSectionIndex, setActiveSectionIndex] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const lesson = LESSONS.find(l => l.id === parseInt(lessonId));

    if (!lesson) return <div>Lesson not found</div>;

    const sections = lesson.sections;

    // Calculate Stats for Result Screen
    const drillSections = sections.filter(s => s.type === 'drill');
    const lessonProgress = progress[lesson.id] || {};

    let totalWpm = 0;
    let totalAcc = 0;
    let drillsCount = 0;
    const drillStats = [];

    drillSections.forEach(ds => {
        const stats = lessonProgress[ds.id];
        if (stats) {
            totalWpm += stats.wpm;
            totalAcc += stats.accuracy;
            drillsCount++;
            drillStats.push({
                name: ds.title.replace('Drill: ', '').replace('Drill', ''),
                wpm: stats.wpm,
                acc: stats.accuracy
            });
        } else {
            drillStats.push({ name: ds.title, wpm: 0, acc: 0 });
        }
    });

    const avgWpm = drillsCount > 0 ? Math.round(totalWpm / drillsCount) : 0;
    const avgAcc = drillsCount > 0 ? Math.round(totalAcc / drillsCount) : 0;
    const isPassed = avgAcc >= 95;

    const handleStartSection = (index) => {
        setActiveSectionIndex(index);
    };

    const handleCompleteSection = (stats) => {
        // Enforce 94% Accuracy Benchmark
        if (stats && stats.accuracy < 94) {
            // Failed
            alert(`Accuracy too low (${stats.accuracy}%). You need 94% to proceed.`);
            // Optionally we could show a nice modal here, but for now blocking alert is functional.
            // We should probably reset the drill so they can try again immediately?
            // Or just leave them on the DrillScreen to click retry?
            // The DrillScreen actually unmounts if we change state? No, we are in DrillScreen.
            // But DrillScreen called onComplete. 
            // If we don't change `activeSectionIndex`, DrillScreen might be in a "finished" state?
            // Current DrillScreen component doesn't have a "Failed" state internally, it just fires onComplete.
            // So if we do nothing, the user is stuck on a finished drill screen?
            // Ideally we should tell DrillScreen to reset? 
            // Or we just re-mount it?

            // Let's simpler: Close drill, show "Failed" message on LessonPage, or specific Failure Modal.
            // For now, let's just alert and maybe restart the same section?
            setActiveSectionIndex(prev => prev); // Trigger re-render? No, value same.

            // Force remount by momentarily nulling?
            // Or better: Show a "Result" overlay inside LessonPage on top of everything?
            // Let's use window.confirm?

            if (window.confirm(`Accuracy: ${stats.accuracy}%. Benchmark: 94%.\n\nYou must retry the section.`)) {
                // Retry same section
                // To reset DrillScreen, we can toggle index null then back? 
                // Or key prop changes? Key is `sections[activeSectionIndex].id`. ID doesn't change.
                // We need to force remount.
                setActiveSectionIndex(null);
                setTimeout(() => setActiveSectionIndex(activeSectionIndex), 50);
            } else {
                setActiveSectionIndex(null); // Return to menu
            }
            return;
        }

        if (activeSectionIndex < sections.length - 1) {
            setActiveSectionIndex(prev => prev + 1);
        } else {
            // Finished lesson
            setActiveSectionIndex(null);
            setShowResults(true);
        }
    };

    const handleCloseDrill = () => {
        setActiveSectionIndex(null);
    };

    const handleRetry = () => {
        setShowResults(false);
        setActiveSectionIndex(0);
    };

    const handleNextLesson = () => {
        const currentId = lesson.id;
        const nextLesson = LESSONS.find(l => l.id === currentId + 1);
        if (nextLesson) {
            navigate(`/lesson/${nextLesson.id}`);
            setShowResults(false);
        } else {
            navigate('/study'); // Or to a Course Completion page
        }
    };

    // If drill is active, show DrillScreen
    if (activeSectionIndex !== null) {
        return (
            <DrillScreen
                key={sections[activeSectionIndex].id}
                section={sections[activeSectionIndex]}
                onComplete={handleCompleteSection}
                onClose={handleCloseDrill}
            />
        );
    }

    // Result Screen
    if (showResults) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-slate-50">
                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header Status */}
                        <div className={`p-8 text-center ${isPassed ? 'bg-green-600' : 'bg-red-500'} text-white`}>
                            {isPassed ? <CheckCircle size={64} className="mx-auto mb-4 opacity-90" /> : <RotateCcw size={64} className="mx-auto mb-4 opacity-90" />}
                            <h2 className="text-4xl font-bold mb-2">{isPassed ? "Lesson Mastered!" : "Keep Practicing"}</h2>
                            <p className="text-xl opacity-90">{isPassed ? "You have met the accuracy requirements." : "You need 95% accuracy to advance."}</p>
                        </div>

                        <div className="p-8">
                            {/* Stats Overview */}
                            <div className="flex justify-center gap-12 mb-12">
                                <div className="text-center">
                                    <p className="text-gray-500 font-bold uppercase text-sm tracking-wider">Net Speed</p>
                                    <p className="text-5xl font-bold text-gray-800">{avgWpm} <span className="text-lg text-gray-400">wpm</span></p>
                                </div>
                                <div className="hidden w-px bg-gray-200 md:block"></div>
                                <div className="text-center">
                                    <p className="text-gray-500 font-bold uppercase text-sm tracking-wider">Accuracy</p>
                                    <p className={`text-5xl font-bold ${isPassed ? 'text-green-600' : 'text-red-500'}`}>{avgAcc}%</p>
                                </div>
                            </div>

                            {/* Graph */}
                            <div className="mb-10">
                                <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                                    <BarChart2 size={20} /> Drill Performance
                                </h3>
                                <div className="h-48 flex items-end gap-4 border-b border-gray-200 pb-2">
                                    {drillStats.map((d, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs p-2 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap">
                                                {d.name}: {d.acc}% / {d.wpm} wpm
                                            </div>

                                            {/* Bar */}
                                            <div className="w-full max-w-[60px] bg-gray-100 rounded-t-lg relative overflow-hidden h-full flex items-end">
                                                <div
                                                    className={`w-full transition-all duration-1000 ${d.acc >= 95 ? 'bg-blue-500' : 'bg-red-400'}`}
                                                    style={{ height: `${d.acc}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 truncate w-full text-center">{i + 1}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 border-t pt-8">
                                <button
                                    onClick={handleRetry}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <RotateCcw size={18} /> Retry Lesson
                                </button>

                                {isPassed ? (
                                    <button
                                        onClick={handleNextLesson}
                                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        Next Lesson <ArrowRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="px-8 py-3 bg-gray-200 text-gray-400 font-bold rounded-lg cursor-not-allowed flex items-center gap-2"
                                    >
                                        Next Lesson <ArrowRight size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
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
                            const isCompleted = !!(lessonProgress && lessonProgress[section.id]);

                            // Check if locked:
                            // Locked if it's not the first one AND the previous one is NOT completed
                            let isLocked = false;
                            if (index > 0) {
                                const prevSection = sections[index - 1];
                                const prevCompleted = !!(lessonProgress && lessonProgress[prevSection.id]);
                                if (!prevCompleted) {
                                    isLocked = true;
                                }
                            }

                            return (
                                <div key={section.id} className={`p-4 border-b last:border-0 transition-colors flex items-center justify-between group ${isLocked ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-4">
                                        {isCompleted ? (
                                            <CheckCircle className="text-green-500" size={24} />
                                        ) : isLocked ? (
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                            </div>
                                        ) : (
                                            <Circle className="text-gray-300" size={24} />
                                        )}
                                        <div>
                                            <p className={`font-medium ${isLocked ? 'text-gray-400' : 'text-gray-800 group-hover:text-blue-600'}`}>{section.id} {section.title}</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">{section.type.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-400">{section.duration}</span>
                                        {isLocked ? (
                                            <button disabled className="px-4 py-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed flex items-center gap-2">
                                                Locked
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStartSection(index)}
                                                className="px-4 py-2 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-blue-700"
                                            >
                                                <Play size={16} fill="currentColor" /> Start
                                            </button>
                                        )}
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
