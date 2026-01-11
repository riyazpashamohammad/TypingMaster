import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { LESSONS } from '../core/lessonData';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Lock } from 'lucide-react';

const DashboardPage = () => {
    const { progress } = useUser();

    return (
        <AppLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Typing Course</h1>
                <p className="text-gray-600 mb-8">Master touch typing with our comprehensive 12-lesson course.</p>

                <div className="grid gap-4">
                    {LESSONS.map((lesson, index) => {
                        // Check progress
                        const lessonStats = progress[lesson.id];

                        let isLocked = false;
                        if (index > 0) {
                            const prevLesson = LESSONS[index - 1];
                            const prevStats = progress[prevLesson.id];

                            // Lock if no progress in previous lesson
                            if (!prevStats || Object.keys(prevStats).length === 0) {
                                isLocked = true;
                            }
                        }

                        // Calculate overall completion % of this lesson for UI
                        const totalSections = lesson.sections.filter(s => s.type === 'drill').length;
                        const completedSections = lessonStats ? Object.keys(lessonStats).length : 0;
                        const percent = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
                        const isCompleted = percent >= 100;

                        return (
                            <div key={lesson.id}
                                className={`bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between transition-all ${isLocked ? 'opacity-60 bg-gray-50' : 'hover:shadow-md hover:border-blue-300'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isLocked ? 'bg-gray-200 text-gray-400' : (isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')}`}>
                                        {isLocked ? <Lock size={20} /> : (isCompleted ? <CheckCircle size={24} /> : lesson.id)}
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>{lesson.title}</h3>
                                        <p className="text-gray-500">{lesson.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    {!isLocked && (
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-700">{completedSections}/{totalSections} Drills</p>
                                            <div className="w-32 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                <div className="h-full bg-green-500 transition-all" style={{ width: `${percent}%` }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {isLocked ? (
                                        <button disabled className="px-6 py-3 bg-gray-200 text-gray-400 font-bold rounded-lg cursor-not-allowed">
                                            Locked
                                        </button>
                                    ) : (
                                        <Link to={`/lesson/${lesson.id}`} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                            {percent > 0 ? 'Continue' : 'Start'} <Play size={16} fill="currentColor" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;
