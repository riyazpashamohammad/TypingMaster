import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { BookOpen, Gamepad2, Keyboard, BarChart2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const MenuCard = ({ to, icon: Icon, title, description, color }) => (
    <Link
        to={to}
        className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-200"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={100} />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white shadow-md ${color}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Start Now <Play size={14} className="ml-1" fill="currentColor" />
            </div>
        </div>
    </Link>
);

const LandingPage = () => {
    const { currentUser } = useUser();

    return (
        <AppLayout>
            <div className="p-8 max-w-7xl mx-auto h-full flex flex-col justify-center">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Welcome back, {currentUser}!</h1>
                    <p className="text-xl text-gray-600">What would you like to improve today?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MenuCard
                        to="/study"
                        icon={BookOpen}
                        title="Studying"
                        description="Complete the comprehensive 12-lesson touch typing course."
                        color="bg-blue-600"
                    />
                    <MenuCard
                        to="/games"
                        icon={Gamepad2}
                        title="Games"
                        description="Fun ways to practice your speed and accuracy buffers."
                        color="bg-purple-600"
                    />
                    <MenuCard
                        to="/test"
                        icon={Keyboard}
                        title="Typing Test"
                        description="Assess your current typing speed with timed tests."
                        color="bg-green-600"
                    />
                    <MenuCard
                        to="/stats"
                        icon={BarChart2}
                        title="Statistics"
                        description="Detailed analysis of your progress and weak keys."
                        color="bg-orange-600"
                    />
                </div>

                {/* Quick Resume or Tip Section could go here */}
                <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-blue-900">Did you know?</h3>
                        <p className="text-gray-600">Resting your fingers on the home row is the secret to touch typing.</p>
                    </div>
                    <Link to="/lesson/1" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow hover:bg-gray-50 transition-colors">
                        Play Lesson 1
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
};

export default LandingPage;
