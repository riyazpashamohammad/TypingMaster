import React from 'react';
import { Link } from 'react-router-dom';
import { LESSONS } from '../core/lessonData';

const DashboardPage = () => {
    return (
        <div className="p-8">
            <h1 className="mb-6 text-3xl font-bold text-blue-800">Studying</h1>
            <div className="space-y-4">
                {LESSONS.map(lesson => (
                    <div key={lesson.id} className="p-4 bg-white border rounded shadow-sm hover:shadow-md">
                        <Link to={`/lesson/${lesson.id}`} className="block">
                            <h2 className="text-xl font-semibold">{lesson.title}</h2>
                            <p className="text-gray-600">{lesson.description}</p>
                            <p className="mt-2 text-sm text-gray-500">{lesson.sections.length} sections</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardPage;
