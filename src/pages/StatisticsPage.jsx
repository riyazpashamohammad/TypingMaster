import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useUser } from '../context/UserContext';
import { BarChart2, Activity, Award } from 'lucide-react';
import { LESSONS } from '../core/lessonData';

const StatisticsPage = () => {
    const { progress } = useUser();

    // Calculate aggregate stats
    let totalWpm = 0;
    let totalAcc = 0;
    let count = 0;

    const lessonStats = LESSONS.map(lesson => {
        // Mock lookup or real lookup
        const lessonProgress = progress[lesson.id] || {};
        let lWpm = 0;
        let lAcc = 0;
        let lCount = 0;

        Object.values(lessonProgress).forEach(stats => {
            if (stats.wpm) {
                lWpm += stats.wpm;
                lAcc += stats.accuracy;
                lCount++;
            }
        });

        if (lCount > 0) {
            totalWpm += lWpm;
            totalAcc += lAcc;
            count += lCount;
            return { id: lesson.id, title: lesson.title, wpm: Math.round(lWpm / lCount), acc: Math.round(lAcc / lCount) };
        }
        return { id: lesson.id, title: lesson.title, wpm: 0, acc: 0 };
    });

    const avgWpm = count > 0 ? Math.round(totalWpm / count) : 0;
    const avgAcc = count > 0 ? Math.round(totalAcc / count) : 0;

    return (
        <AppLayout>
            <div className="p-8 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-900 mb-8">Typing Statistics</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                            <Activity size={32} />
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase text-xs font-bold">Average Speed</p>
                            <p className="text-3xl font-bold text-gray-800">{avgWpm} <span className="text-sm">WPM</span></p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
                        <div className="bg-green-100 p-4 rounded-full text-green-600">
                            <BarChart2 size={32} />
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase text-xs font-bold">Accuracy</p>
                            <p className="text-3xl font-bold text-gray-800">{avgAcc}%</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
                        <div className="bg-purple-100 p-4 rounded-full text-purple-600">
                            <Award size={32} />
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase text-xs font-bold">Lessons Completed</p>
                            <p className="text-3xl font-bold text-gray-800">{lessonStats.filter(l => l.wpm > 0).length} <span className="text-sm">/ 12</span></p>
                        </div>
                    </div>
                </div>

                {/* Simple Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h2 className="text-xl font-bold mb-6">Course Progress</h2>
                    <div className="h-64 flex items-end gap-2">
                        {lessonStats.map(ls => (
                            <div key={ls.id} className="flex-1 flex flex-col items-center group relative">
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs p-2 rounded pointer-events-none transition-opacity z-10 w-32 text-center">
                                    {ls.title}<br />{ls.wpm} WPM / {ls.acc}%
                                </div>
                                <div
                                    className="w-full bg-blue-200 rounded-t transition-all duration-500 relative"
                                    style={{ height: `${Math.min(ls.wpm * 2, 100)}%` }} // Scale factor
                                >
                                    {ls.wpm > 0 && <div className="absolute bottom-0 w-full bg-blue-500" style={{ height: `${ls.acc}%`, opacity: 0.5 }}></div>}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 truncate w-full text-center">{ls.id}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-center text-xs text-gray-400">Lesson ID</div>
                </div>
            </div>
        </AppLayout>
    );
};

export default StatisticsPage;
