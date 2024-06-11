import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DisponibilidadAgenda from './pages/DisponibilidadAgenda';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/DisponibilidadAgenda" element={<DisponibilidadAgenda />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;