import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import './Header.css';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { AppBar, Toolbar,Popover, Typography, Box  } from '@mui/material';
const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


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

//   return (
//     <nav className="navbar navbar-dark bg-dark fixed-top">
      

//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           <img src="logos/logo.jpeg" alt="logo" className="navbar-logo" />
//         </Link>
//         <Toolbar>
//         <Stack spacing={4} direction="row" justifyContent="flex-end" sx={{ flexGrow: 1 }}>
//           <Badge color="secondary" badgeContent={1}>
//             <MailIcon sx={{ color: 'white' }} />
//           </Badge>
//         </Stack>
//       </Toolbar>
//         <button className="btn btn-primary" id="boton_hamburguesa" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
//           <i className="bi bi-list"></i>
//         </button>

//         <div className="offcanvas offcanvas-end offcanvas-translucent-dark" data-bs-theme="dark" data-bs-scroll="true" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
//           <div className="offcanvas-header">
//             <h5 className="offcanvas-title" id="offcanvasRightLabel">Avance.Fit Menú</h5>
//             <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//           </div>
//           <div className="offcanvas-body d-flex flex-column">
//             <ul className="nav flex-column flex-grow-1" id="pestañas_hamburguesa">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/"><i className="bi bi-house-door"></i> Home</Link>
//               </li>
//               {!isAuthenticated && (
//                 <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/Login"><i className="bi bi-box-arrow-in-right"></i> Login</Link>
//                 </li>
//                  <li className="nav-item">
//                  <Link className="nav-link" to="/AgendaUsuarios" ><i className="bi bi-calendar-week"></i> Agenda</Link>
//                </li>
//                </>
//               )}
//               {isAuthenticated && isAdmin &&(
//                 <>
                 
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/DisponibilidadAgenda"><i className="bi bi-calendar2-check"></i> Disponibilidad</Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/ListarUsuarios"><i className="bi bi-person-lines-fill"></i> Listar Usuarios</Link>
//                   </li>
//                   <li className="nav-item">
//                 <Link className="nav-link" to="/ejercicios"> <img src="/iconos/ejercicio.png" alt="Ejercicio Icono" style={{ width: '25px' }} /> Ejercicios</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/rutinas"> <img src="/iconos/rutina.png" alt="Rutina Icono" style={{ width: '25px' }} /> Rutinas</Link>
//                 </li>
//                 </>
//               )}
//             </ul>
//             {isAuthenticated && (
//               <ul className="nav flex-column mt-auto" id="pestañas_hamburguesa">
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/" onClick={handleLogout}><i className="bi bi-lock"></i> Cerrar Sesion</Link>
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };
return(
  <nav className="navbar navbar-dark bg-dark fixed-top">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">
        <img src="logos/logo.jpeg" alt="logo" className="navbar-logo" />
      </Link>
      {isAuthenticated &&(
      <Toolbar style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <Stack spacing={4} direction="row" sx={{ alignItems: 'center' }}>
          <Badge color="secondary" badgeContent={1} onClick={handleClick} sx={{ cursor: 'pointer' }}>
            <MailIcon sx={{ color: 'white' }} />
          </Badge>
        </Stack>
      </Toolbar>
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
          </ul>
          {isAuthenticated && (
            <ul className="nav flex-column mt-auto" id="pestañas_hamburguesa">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleLogout}><i className="bi bi-lock"></i> Cerrar Sesion</Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notificaciones</Typography>
          <Typography variant="body1">No tienes nuevas notificaciones.</Typography>
        </Box>
      </Popover>
    </div>
  </nav>
);
};
export default Header;