import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="logos/logo.png" alt="logo" className="navbar-logo" />
          Avance.fit
        </Link>
        <button className="btn btn-primary" id="boton_hamburguesa" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
          <i className="bi bi-list"></i>
        </button>

        <div className="offcanvas offcanvas-end" data-bs-theme="dark" data-bs-scroll="true" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasRightLabel">Avance.Fit Menú</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <ul className="nav flex-column flex-grow-1" id="pestañas_hamburguesa">
              <li className="nav-item">
                <Link className="nav-link" to="/"><i className="bi bi-house-door"></i> Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/agenda"><i className="bi bi-calendar-week"></i> Agenda</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/disponibilidadagenda"><i class="bi bi-calendar2-check"></i> Disponibilidad</Link>
              </li>
            </ul>
            <ul className="nav flex-column mt-auto" id="pestañas_hamburguesa">
              <li className="nav-item">
                <Link className="nav-link" to="/logout"><i className="bi bi-lock"></i> Cerrar Sesion</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;