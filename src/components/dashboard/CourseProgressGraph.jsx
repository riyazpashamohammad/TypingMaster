import React, { useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { LESSONS } from '../../core/lessonData';
import { TrendingUp, BarChart2 } from 'lucide-react';

const CourseProgressGraph = () => {
    const { progress } = useUser();

    // Calculate stats per lesson
    const data = useMemo(() => {
        return LESSONS.map(lesson => {
            const lessonStats = progress[lesson.id] || {};
            const sections = Object.values(lessonStats);

            if (sections.length === 0) return { id: lesson.id, label: `L${lesson.id}`, wpm: 0, accuracy: 0, active: false };

            const totalWpm = sections.reduce((acc, curr) => acc + (curr.wpm || 0), 0);
            const totalAcc = sections.reduce((acc, curr) => acc + (curr.accuracy || 0), 0);

            return {
                id: lesson.id,
                label: `L${lesson.id}`,
                wpm: Math.round(totalWpm / sections.length),
                accuracy: Math.round(totalAcc / sections.length),
                active: true
            };
        });
    }, [progress]);

    const activeData = data.filter(d => d.active);

    if (activeData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-200">
                    <BarChart2 size={32} />
                </div>
                <h3 className="text-gray-500 font-medium">No progress data yet</h3>
                <p className="text-sm text-gray-400">Complete lessons to see your improvement curve!</p>
            </div>
        );
    }

    // Chart dimensions
    const width = 600;
    const height = 200;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const maxWpm = Math.max(60, ...activeData.map(d => d.wpm));

    // Scale functions
    const getX = (index) => padding + (index / (Math.max(1, data.length - 1))) * graphWidth;
    const getY = (wpm) => height - padding - (wpm / maxWpm) * graphHeight;

    // Build path
    let pathParam = "";
    data.forEach((d, i) => {
        const x = getX(i);
        const y = getY(d.active ? d.wpm : 0);
        if (i === 0) pathParam += `M ${x} ${y}`;
        else pathParam += ` L ${x} ${y}`;
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" /> Improvement Curve
                </h2>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> WPM
                    </div>
                    {/* Placeholder for accuracy if we added it */}
                </div>
            </div>

            <div className="relative w-full aspect-[3/1]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(t => {
                        const y = height - padding - (t * graphHeight);
                        return (
                            <g key={t}>
                                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                                <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-mono">
                                    {Math.round(t * maxWpm)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Path (Gradient Fill) */}
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area under curve */}
                    <path
                        d={`${pathParam} L ${getX(data.length - 1)} ${height - padding} L ${padding} ${height - padding} Z`}
                        fill="url(#gradient)"
                    />

                    {/* Line */}
                    <path d={pathParam} fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Active Line Segment */}
                    {/* We need to construct logic to only show solid line for active parts. 
                        Simplification: Just show dots for active points.
                     */}

                    {/* Data Points */}
                    {data.map((d, i) => {
                        if (!d.active) return <circle key={d.id} cx={getX(i)} cy={getY(0)} r="2" fill="#e5e7eb" />;
                        return (
                            <g key={d.id} className="group">
                                <circle
                                    cx={getX(i)}
                                    cy={getY(d.wpm)}
                                    r="4"
                                    fill="#3b82f6"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="transition-all duration-300 group-hover:r-6"
                                />
                                {/* Tooltip */}
                                <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <rect x={getX(i) - 25} y={getY(d.wpm) - 35} width="50" height="25" rx="4" fill="#1f2937" />
                                    <text x={getX(i)} y={getY(d.wpm) - 19} textAnchor="middle" fill="white" className="text-[10px] font-bold">
                                        {d.wpm} WPM
                                    </text>
                                </g>
                                <text x={getX(i)} y={height - padding + 20} textAnchor="middle" className="text-[10px] fill-gray-500 font-medium">
                                    {d.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default CourseProgressGraph;
