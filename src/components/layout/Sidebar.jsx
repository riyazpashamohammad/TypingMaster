import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, BarChart2, Edit, Keyboard, Gamepad2, PieChart, Settings, Info } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive
                ? 'bg-gradient-to-r from-blue-100 to-white text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
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
        <div className="flex flex-col w-64 h-full bg-white border-l shadow-lg">
            <div className="flex items-center justify-end p-2">
                {/* Close / Minimize placeholders if needed */}
            </div>

            <nav className="flex-1 py-4 space-y-1">
                <SidebarItem to="/study" icon={BookOpen} label="STUDYING" />
                <SidebarItem to="/meter" icon={BarChart2} label="TYPING METER" />
                <SidebarItem to="/review" icon={Edit} label="CUSTOM REVIEW" />
                <SidebarItem to="/test" icon={Keyboard} label="TYPING TEST" />
                <SidebarItem to="/games" icon={Gamepad2} label="GAMES" />
                <SidebarItem to="/stats" icon={PieChart} label="STATISTICS" />
                <SidebarItem to="/settings" icon={Settings} label="SETTINGS" />
                <SidebarItem to="/about" icon={Info} label="ABOUT" />
            </nav>

            <div className="p-4 border-t">
                <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500">Log out</button>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">T</div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">TypingMaster</p>
                        <p className="text-xs text-gray-500">Pro Version</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
