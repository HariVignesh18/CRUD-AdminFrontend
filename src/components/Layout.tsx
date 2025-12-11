import React, { useState } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    return (
        <div>
            <Navbar visible={sidebarVisible} setVisible={setSidebarVisible} />
            <div className='full-screen'>
                {children}
            </div>
        </div>
    );
};

export default Layout;
