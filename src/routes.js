import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
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
                <Route path="/ListarUsuarios" element={<ListarUsuarios />} />
                <Route path="/CrearUsuario" element={<CrearUsuario />} />
                {/* <Route path="/EditarUsuario" element={<EditarUsuario />} /> */}
                <Route path="/EditarUsuario/:email" element={<EditarUsuario />} />
                <Route path="/RecuperarPassword" element={<RecuperarPassword />} />
                <Route path="/DesactivarUsuario" element={<DesactivarUsuario />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;