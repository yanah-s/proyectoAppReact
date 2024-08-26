// AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import DisponibilidadAgenda from './pages/DisponibilidadAgenda';
import AgendaUsuarios from './pages/AgendaUsuarios';
import ListarUsuarios from './pages/ListarUsuarios';
import EditarUsuario from './pages/EditarUsuario';
import DesactivarUsuario from './pages/DesactivarUsuario';
import Login from './pages/Login';
import RecuperarPassword from './pages/RecuperarPassword';
import EditarUsuarioDesdeAdmin from './pages/EditarUsuarioDesdeAdmin';
import Logout from './pages/Logout';
import Ejercicios from './pages/Ejercicios';
import Rutinas from './pages/rutinas';
import Avances from './pages/Avances';
import AgendaAlumno from './pages/AgendaAlumno';
import VerRutinas from './pages/VerRutinas';
import AvancesUsuarios from './pages/AvancesUsuarios';
import Motivacion from './pages/Motivacion';
import ObjetivosMetas from './pages/ObjetivosMetas';
const AppRoutes = () => {
  //  const isAuthenticated = !!localStorage.getItem('token');
  //  const isAdmin =  localStorage.getItem('admin') === 'true';
  //  (isAdmin + isAuthenticated);
    return (
     
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/ejercicios" element={<Ejercicios />} />
          <Route path="/rutinas" element={<Rutinas />} />
          <Route path="/verRutinas" element={<VerRutinas />} />
          <Route path="/objetivos-metas" element={<ObjetivosMetas />} />
          {/* <Route path="/CrearUsuario" element={<CrearUsuario />} /> */}
          <Route path="/AgendaUsuarios" element={<AgendaUsuarios />} />
            
              {/* <Route path="/ejercicios" element={<Ejercicios />} />
              <Route path="/rutinas" element={<Rutinas />} /> */}
              <Route path="/DisponibilidadAgenda" element={<DisponibilidadAgenda />} />
              <Route path="/ListarUsuarios" element={<ListarUsuarios />} />
              <Route path="/editar/:id" element={<EditarUsuario />} />
              <Route path="/DesactivarUsuario" element={<DesactivarUsuario />} />
              <Route path="/EditarUsuarioDesdeAdmin/:id" element={<EditarUsuarioDesdeAdmin />} />
              <Route path="/AvancesUsuarios" element={<AvancesUsuarios />} />
          
            <>
            <Route path="/Motivacion" element={<Motivacion />} />

            <Route path="/AgendaAlumno" element={<AgendaAlumno />} />
            <Route path="/Avances" element={<Avances />} />
            <Route path="/Logout" element={<Logout />} /></> 
            
          {/* } */}
          
        </Routes>
      </Router>
    );
  };
  

export default AppRoutes;
