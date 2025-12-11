import React, { createContext, useRef, ReactNode } from 'react';
import { Toast } from 'primereact/toast';

interface ToastContextType {
    showToast: (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
});

interface ToastContextProviderProps {
    children: ReactNode;
}

export const ToastContextProvider: React.FC<ToastContextProviderProps> = ({ children }) => {
    const toast = useRef<Toast>(null);

    const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Toast ref={toast} position="top-right" />
            {children}
        </ToastContext.Provider>
    );
};
