import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Ejercicios from './pages/Ejercicios';
import DisponibilidadAgenda from './pages/DisponibilidadAgenda';
import Rutinas from './pages/rutinas';

const AppRoutes = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/disponibilidadagenda" element={<DisponibilidadAgenda />} />
                <Route path="/ejercicios" element={<Ejercicios />} />
                <Route path="/rutinas" element={<Rutinas />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;