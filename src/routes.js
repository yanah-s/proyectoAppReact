import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';

import DisponibilidadAgenda from './pages/DisponibilidadAgenda';

const AppRoutes = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/disponibilidadagenda" element={<DisponibilidadAgenda />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;