import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Gamepad2, Cloud, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const GAMES = [
    { id: 'bubbles', title: 'Bubbles', description: 'Pop bubbles by typing words before they reach the top.', icon: Gamepad2, color: 'bg-blue-500' },
    { id: 'clouds', title: 'Neon Runner', description: 'Sprint through a cyberpunk city by smashing obstacles.', icon: Cloud, color: 'bg-purple-600' },
    { id: 'tris', title: 'Cosmic Defense', description: 'Defend your base from incoming enemies in all directions.', icon: FileText, color: 'bg-indigo-600' },
];

const GamesPage = () => {
    return (
        <AppLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold text-blue-900 mb-8">Typing Games</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMES.map(game => (
                        <Link to={`/games/${game.id}`} key={game.id} className="block transform transition-transform hover:-translate-y-1">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                                <div className={`${game.color} h-32 flex items-center justify-center text-white`}>
                                    <game.icon size={48} />
                                </div>
                                <div className="p-6 flex-1">
                                    <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                                    <p className="text-gray-600">{game.description}</p>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t">
                                    <span className="text-blue-600 font-medium">Play Now &rarr;</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
};

export default GamesPage;
