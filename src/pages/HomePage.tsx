import React from 'react';
import { Card } from 'primereact/card';

const HomePage: React.FC = () => {
    return (
        <div className="flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <Card className="text-center" style={{ maxWidth: '600px', padding: '2rem' }}>
                <h1 style={{
                    margin: 0,
                    marginBottom: '1rem',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#1976d2'
                }}>
                    Sample Admin Dashboard
                </h1>
                <p style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    color: '#181818ff',
                    lineHeight: '1.6'
                }}>
                    Manage your database tables with the generic CRUD interface
                </p>
            </Card>
        </div>
    );
};

export default HomePage;
