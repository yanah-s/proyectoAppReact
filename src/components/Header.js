import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import './Header.css';
import { useState, useEffect } from 'react';
import Notificaciones from './Notificaciones';
const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Función para actualizar el estado de autenticación y administrador desde localStorage
    const updateAuthState = () => {
      const token = localStorage.getItem('token');
      const admin = localStorage.getItem('admin') === 'true';
      setIsAuthenticated(!!token);
      setIsAdmin(admin);
    };

    // Actualizar al montar el componente
    updateAuthState();

    // Escuchar la señal de inicio de sesión
    const handleSesionIniciada = () => {
      updateAuthState(); // Actualizar el estado cuando se inicia sesión
    };

    window.addEventListener('sesionIniciada', handleSesionIniciada);

    return () => {
      window.removeEventListener('sesionIniciada', handleSesionIniciada);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };
return(
  <nav className="navbar navbar-dark bg-dark fixed-top">
    <div className="container-fluid">
       
      <Link className="navbar-brand" to="/">
        <img src="logos/logo.jpeg" alt="logo" className="navbar-logo" />
      </Link>
      <div className="notificacionesYmenu">
      {isAuthenticated &&(
      <Notificaciones/>
       )}
      <button
        className="btn btn-primary"
        id="boton_hamburguesa"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        <i className="bi bi-list"></i>
      </button>
     
      <div
        className="offcanvas offcanvas-end offcanvas-translucent-dark"
        data-bs-theme="dark"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">Avance.Fit Menú</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <ul className="nav flex-column flex-grow-1" id="pestañas_hamburguesa">
            <li className="nav-item">
              <Link className="nav-link" to="/"><i className="bi bi-house-door"></i> Home</Link>
            </li>
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Login"><i className="bi bi-box-arrow-in-right"></i> Login</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/AgendaUsuarios"><i className="bi bi-calendar-week"></i> Agenda</Link>
                </li>
              </>
            )}
            {isAuthenticated && isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/DisponibilidadAgenda"><i className="bi bi-calendar2-check"></i> Disponibilidad</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ListarUsuarios"><i className="bi bi-person-lines-fill"></i> Listar Usuarios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ejercicios"> <img src="/iconos/ejercicio.png" alt="Ejercicio Icono" style={{ width: '25px' }} /> Ejercicios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/rutinas"> <img src="/iconos/rutina.png" alt="Rutina Icono" style={{ width: '25px' }} /> Rutinas</Link>
                </li>

              </>
            )}
            {isAuthenticated && !isAdmin &&(
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/verRutinas" ><img src="/iconos/rutina.png" alt="Rutina Icono" style={{ width: '25px' }} /> Ver Rurina</Link>
                </li>
              </>
            )}
          </ul>
          {isAuthenticated && (
            <ul className="nav flex-column mt-auto" id="pestañas_hamburguesa">
                <li className="nav-item">
                  <Link className="nav-link" to="/Avances"><i className="bi-bar-chart-line"></i> Avances </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/AgendaAlumno"><i className="bi bi-calendar-week"></i> Agendar consulta </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/editar/:id"><i className="bi bi-box-arrow-in-right"></i> Editar datos</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleLogout}><i className="bi bi-lock"></i> Cerrar Sesion</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
    </div>
  </nav>
);
};
export default Header;