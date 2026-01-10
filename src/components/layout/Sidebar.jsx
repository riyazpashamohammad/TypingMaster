import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, BarChart2, Edit, Keyboard, Gamepad2, PieChart, Settings, Info } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive
                ? 'bg-blue-50 text-blue-700 shadow-sm translate-x-1'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
        }
    >
        <Icon size={18} />
        {label}
    </NavLink>
);

const Sidebar = () => {
    const { logout } = useUser();

    return (
        <div className="flex flex-col w-64 h-full bg-white border-l border-gray-200 shadow-xl z-10">

            {/* Brand Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Keyboard size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-bold leading-tight">TypingMaster</p>
                        <p className="text-xs text-blue-100 opacity-80">Pro Version</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                <SidebarItem to="/" icon={BookOpen} label="HOME" />
                <SidebarItem to="/study" icon={BookOpen} label="STUDYING" />
                <SidebarItem to="/test" icon={Keyboard} label="TYPING TEST" />
                <SidebarItem to="/games" icon={Gamepad2} label="GAMES" />
                <SidebarItem to="/stats" icon={PieChart} label="STATISTICS" />
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <SidebarItem to="/settings" icon={Settings} label="SETTINGS" />
                    <SidebarItem to="/about" icon={Info} label="ABOUT" />
                </div>
            </nav>

            <div className="p-4 border-t">
                <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500">Log out</button>
            </div>
        </div>
    );
};
export default Sidebar;
