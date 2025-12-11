import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Refine } from "@refinedev/core";
import routerBindings from "@refinedev/react-router-v6";
import { dataProvider } from "./refine/dataProvider";

import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import GenericCRUDRefine from './components/GenericCRUDRefine';
import Layout from './components/Layout';

import { ToastContextProvider } from './context/ToastContext';
import { DialogContextProvider } from './context/DialogContext';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './styles/app.scss';

const API_URL = "http://localhost:5081";

function App() {
    return (
        <ToastContextProvider>
            <DialogContextProvider>
                <BrowserRouter>
                    <Refine
                        dataProvider={dataProvider(API_URL)}
                        routerProvider={routerBindings}
                        resources={[
                            // We define a wildcard resource or just let the generic route handle it.
                            // Refine usually likes to know resources, but for a fully dynamic generic tool,
                            // we can just use the hooks with explicit 'resource' names.
                            {
                                name: "generic",
                                list: "/generic/:table",
                            }
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}
                    >
                        <Layout>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/generate" element={<GeneratePage />} />
                                <Route path="/generic/:table" element={<GenericCRUDRefine />} />
                            </Routes>
                        </Layout>
                    </Refine>
                </BrowserRouter>
            </DialogContextProvider>
        </ToastContextProvider>
    );
}

export default App;
