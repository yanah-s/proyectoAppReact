import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const agendar = () => {
        // Lógica para manejar el click del botón
        console.log('¡Agéndate!');
    };

    return (
        <main className="container-fluid">
			<section className="row text-center pb-5">
				<h1 className="col-12 mt-3">
					¡Bienvenido a Avance.fit, un espacio de transformación! Aquí nos dedicaremos a potenciar tu salud y ayudarte alcanzar tus metas fitness. Con un programa personalizado y un enfoque integral, te guiaremos en cada paso hacia una versión más fuerte, más saludable y más feliz de ti mismo. Unete y comienza tu viaje hacia una vida activa y plena.
				</h1>
				<nav className="col-12 mb-5">
					<ul className="list-unstyled list-inline text-center">
						<li className="list-inline-item">
                            <Link className="p-2 rounded" to="/agenda">Agendate YA!</Link>
						</li>
					</ul>
				</nav>
			</section>
			<section className=" row justify-content-center text-center mt-2 pt-3">
				<h2 className="col-12 w-100" id="navidad">Sobre mi:</h2>
				<figure className="d-none d-md-block col-md-5">
					<img src="images/lucia.jpg" className="img-fluid" alt=""/>
				</figure>
				<article className="col-8 col-md-3 sobreMI">
					<span><img src="img/candy.png" alt=""/></span>
					<p>Mi nombre es Lucía, entrenadora personal y técnica en musculación avalada por la IFBB. Mi pasión por la salud y el fitness me impulsa a seguir expandiendo mis conocimientos en el Instituto Superior de Educación Física, garantizando así un contenido de máxima calidad para ti. Mi misión es acompañarte en el camino hacia tus objetivos fitness, brindándote el apoyo y la guía necesarios para alcanzar el éxito. ¡Juntos lograremos resultados que transformarán tu vida!"</p>
				</article>
			</section>
			{/* <section className="row text-center d-none d-sm-block">
				<h2 className="col-12 pt-5">la famila unida</h2>
			</section>
			<section className="row justify-content-center mb-4">
				<h2 className="col-12 text-center m-3" id="vendidos"><span><img src="img/gift.png" alt=""/></span>Más Vendidos<span><img src="img/gift.png" alt=""/></span></h2>
				<article className="col-12 col-sm-6 col-md-6 col-lg-3 text-center">
					<figure>
						<img src="img/arbol_1.jpg" alt="" className="img-fluid"/>
					</figure>
					<h3>Sólo Verde</h3>
					<h4>$329</h4>
				</article>
				<article className="col-12 col-sm-6  col-md-6 col-lg-3 text-center">
					<figure>
						<img src="img/arbol_2.jpg" alt="" className="img-fluid"/>
					</figure>
					<h3>Luces Multicolor</h3>
					<h4>$999</h4>
				</article>
				<article className="d-none d-md-block col-md-6 col-lg-3 text-center">
					<figure>
						<img src="img/arbol_3.jpg" alt="" className="img-fluid"/>
					</figure>
					<h3>Estilo USA</h3>
					<h4>$2399</h4>
				</article>
				<article className="d-none d-md-block col-md-6 col-lg-3 text-center">
					<figure>
						<img src="img/arbol_4.jpg" alt="" className="img-fluid"/>
					</figure>
					<h3>Verde con Luces</h3>
					<h4>$379</h4>
				</article>

			</section>
			<section className="row text-center d-none d-lg-block">
				<h2 className="col-12 pt-5">#nosCuidamosEntreTodos</h2>
			</section>
			<section className="row justify-content-center text-center py-4">
				<h2 className="col-12 mb-4" id="contacto">¡Dejanos tu contacto!</h2>
				<form action="" className="col-6">
					<input type="text" className="w-75 mb-2 text-center p-2" placeholder="Ingresa tu e-mail"></input>
					<input type="submit" value="Enviar" className="w-25 mb-2 p-2"></input>
				</form>

			</section> */}

			<footer className="row text-center pt-3 colorPrincipal">
				<nav className="col-12">
					<ul className="list-inline">
						<li className="list-inline-item"><img src="/iconos/facebook.png" alt="Facebook"/></li>
						<li className="list-inline-item"><img src="/iconos/instagram.png" alt="instagram"/></li>
					</ul>
				</nav>
			</footer>
		</main>
    );
};

export default Home;
