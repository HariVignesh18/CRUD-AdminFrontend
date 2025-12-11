import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { genericApi } from '../api/genericApi';

import '../styles/navbar.scss';

interface MenuBarProps {
    setVisible: (visible: boolean) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ setVisible }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tables, setTables] = useState<string[]>([]);

    useEffect(() => {
        // Fetch only configured tables (those that have been set up via Generator)
        // This ensures tables don't appear until explicitly configured
        genericApi.getTables()
            .then(async (res) => {
                // Instead of showing all database tables, show only configured ones
                try {
                    const configRes = await fetch('http://localhost:5081/api/table_configurations');
                    const configData = await configRes.json();
                    if (configData.success && configData.data) {
                        setTables(configData.data);
                    } else {
                        setTables([]);
                    }
                } catch (error) {
                    console.error('Failed to load configured tables:', error);
                    setTables([]);
                }
            })
            .catch(err => {
                console.error('Failed to connect to backend:', err);
                setTables([]);
            });
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
        setVisible(false);
    };

    const isActive = (path: string) => location.pathname === path;

    // This will be populated dynamically once we integrate with the backend
    const menuItems = [
        { label: 'Home', path: '/' },
        { label: 'Generator', path: '/generate' },
    ];

    return (
        <div className='w-full'>
            <div className='uppercase text-black font-bold my-3 block text-lg'>
                Menu
            </div>

            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => handleNavigation(item.path)}
                >
                    {item.label}
                </div>
            ))}

            <div className='uppercase text-black font-bold my-3 block text-lg mt-5'>
                Generic Tables
            </div>

            {tables.length === 0 ? (
                <div className='text-gray-500 text-sm p-2'>
                    No configured tables. Use Generator to add tables.
                </div>
            ) : (
                tables.map((table) => (
                    <div
                        key={table}
                        className={`nav-link ${isActive(`/generic/${table}`) ? 'active' : ''}`}
                        onClick={() => handleNavigation(`/generic/${table}`)}
                    >
                        <i className="pi pi-table mr-2"></i>
                        {table}
                    </div>
                ))
            )}
        </div>
    );
};

export default MenuBar;
