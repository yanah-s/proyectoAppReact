import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DisponibilidadAgenda from './pages/DisponibilidadAgenda';
import AgendaUsuarios from './pages/AgendaUsuarios';
import ListarUsuarios from './pages/ListarUsuarios';
import CrearUsuario from './pages/CrearUsuario';
import EditarUsuario from './pages/EditarUsuario';
import DesactivarUsuario from './pages/DesactivarUsuario';
import Login from './pages/Login';
import RecuperarPassword from './pages/RecuperarPassword';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/DisponibilidadAgenda" element={<DisponibilidadAgenda />} />
                <Route path="/AgendaUsuarios" element={<AgendaUsuarios />} />
                <Route path="/ListarUsuarios" element={<ListarUsuarios />} />
                <Route path="/CrearUsuario" element={<CrearUsuario />} />
                <Route path="/EditarUsuario/:email" element={<EditarUsuario />} />
                <Route path="/RecuperarPassword" element={<RecuperarPassword />} />
                <Route path="/DesactivarUsuario" element={<DesactivarUsuario />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
