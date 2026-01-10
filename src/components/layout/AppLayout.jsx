import React from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <main className="flex-1 overflow-auto">
                {children}
            </main>
            <Sidebar />
        </div>
    );
};

export default AppLayout;
