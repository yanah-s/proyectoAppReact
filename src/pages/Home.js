import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="bienvenida">
                <h1 className="bienvenida_titulo">Bienvenido a la página principal</h1>
            </div>
            <div className="center-image-container">
                <a href="/agenda">
                    <img src="images/agenda.jpg" alt="Agenda" className="agenda-image" />
                </a>
            </div>
            <footer className="footer">
                <div className="social-icons">
                    <h5>Seguinos</h5>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="iconos/facebook.png" alt="Facebook" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="iconos/instagram.png" alt="Instagram" />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Home;