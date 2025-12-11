import React from 'react';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { useNavigate } from 'react-router-dom';

import MenuBar from './MenuBar';

import '../styles/navbar.scss';

interface NavbarProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ visible, setVisible }) => {
    const navigate = useNavigate();

    const logoClickHandler = () => {
        navigate('/');
    };

    return (
        <>
            <div className='container max-w-full sticky top-0 z-10 border-b bg-white'>
                <div className='navbar'>
                    <div className='flex w-full items-center'>
                        <div className='grow flex items-center'>
                            <h2
                                style={{
                                    cursor: 'pointer',
                                    margin: 0,
                                    fontSize: '1.5rem',
                                    fontWeight: 600,
                                    color: '#1976d2'
                                }}
                                onClick={logoClickHandler}
                            >
                                Sample Admin Panel
                            </h2>
                            <Button
                                icon={visible ? 'pi pi-times' : 'pi pi-bars'}
                                className='sm:ml-5 ml-2 p-button-rounded p-button-outlined'
                                onClick={() => setVisible(!visible)}
                                tooltip={visible ? 'Hide Menubar' : 'Show Menubar'}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar
                visible={visible}
                position='left'
                onHide={() => setVisible(false)}
                className='p-sidebar-sm'
            >
                <MenuBar setVisible={setVisible} />
            </Sidebar>
        </>
    );
};

export default Navbar;
