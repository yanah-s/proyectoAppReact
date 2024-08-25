import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import Motivacion from './Motivacion'; // Asegúrate de importar el componente Motivacion
import './Home.css';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [motivacionMessage, setMotivacionMessage] = useState('');
  const [showMotivacion, setShowMotivacion] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Actualizar al montar el componente
    updateAuthState();

    // Escuchar la señal de inicio de sesión
    const handleSesionIniciada = () => {
      updateAuthState(); // Actualizar el estado cuando se inicia sesión
    };

    window.addEventListener('sesionIniciada', handleSesionIniciada);

    // Verificar si hay un mensaje de motivación
    const mensaje = localStorage.getItem('motivacionMessage');
    if (mensaje) {
      setMotivacionMessage(mensaje);
      setShowMotivacion(true);
      localStorage.removeItem('motivacionMessage'); // Eliminar el mensaje después de mostrarlo
    }

    return () => {
      window.removeEventListener('sesionIniciada', handleSesionIniciada);
    };
  }, []);

  const handleCloseMotivacion = () => setShowMotivacion(false);

  return (
    <main className="container-fluid">
      <Motivacion
        isOpen={showMotivacion}
        onRequestClose={handleCloseMotivacion}
        message={motivacionMessage}
      />
      
      <section className="row text-center justify-content-center mt-2 pt-3">
        <figure className="d-none d-md-block col-md-5">
          <div className="imgBienvenido">
            <img src="images/bienvenido.jpg" className="img-fluid" alt="" />
          </div>
        </figure>
        <article className="col-12 col-md-5 d-flex flex-column justify-content-center sobreMI">
          <h3>Bienvenido a <span className='resaltadoLetra'>Avance.fit</span>, un espacio de transformación.</h3>
          <br />
          <p> Aquí nos dedicaremos a potenciar tu salud y ayudarte alcanzar tus metas fitness.</p>
          <p> Con un programa personalizado y un enfoque integral, te guiaremos en cada paso hacia una versión más fuerte, más saludable y más feliz de ti mismo.</p>
          <p> Únete y comienza tu viaje hacia una vida activa y plena.</p>
        </article>
      </section>

      <section>
        {!isAuthenticated && (
          <nav className="col-12 mb-5">
            <ul className="list-unstyled list-inline text-center">
              <li className="list-inline-item">
                <Link className="p-2 rounded" to="/AgendaUsuarios">¡Agéndate YA!</Link>
              </li>
            </ul>
          </nav>
        )}
      </section>
      <section className="row justify-content-center text-center mt-2 pt-3 translucent-background">
        <article className="col-12 col-md-5 sobreMI">
          <p>Mi nombre es Lucía, entrenadora personal y técnica en musculación avalada por la IFBB. Mi pasión por la salud y el fitness me impulsa a seguir expandiendo mis conocimientos en el Instituto Superior de Educación Física, garantizando así un contenido de máxima calidad para ti. Mi misión es acompañarte en el camino hacia tus objetivos fitness, brindándote el apoyo y la guía necesarios para alcanzar el éxito.</p>
          <p>¡Juntos lograremos resultados que transformarán tu vida!</p>
        </article>
      </section>

      <footer className="row text-center colorPrincipal">
        {/* <nav className="navbar">
          <div className="social-icons">
            <div className="icon-container">
              <FontAwesomeIcon icon={faGoogle} style={{ color: '#dd4b39' }} />
            </div>
            <div className="icon-container">
              <FontAwesomeIcon icon={faInstagram} style={{ color: '#ac2bac' }} />
            </div>
            <div className="icon-container">
              <FontAwesomeIcon icon={faLinkedinIn} style={{ color: '#0082ca' }} />
            </div>
          </div>
        </nav> */}
      </footer>
    </main>
  );
};

export default Home;
