import React, { createContext, useState, ReactNode } from 'react';

interface DialogContextType {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const DialogContext = createContext<DialogContextType>({
    visible: false,
    setVisible: () => { },
});

interface DialogContextProviderProps {
    children: ReactNode;
}

export const DialogContextProvider: React.FC<DialogContextProviderProps> = ({ children }) => {
    const [visible, setVisible] = useState(false);

    return (
        <DialogContext.Provider value={{ visible, setVisible }}>
            {children}
        </DialogContext.Provider>
    );
};
