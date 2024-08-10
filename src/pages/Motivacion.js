// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { useSpring, animated } from 'react-spring';
// import './Motivacion.css';

// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)',
//     padding: '20px',
//     borderRadius: '10px',
//     textAlign: 'center',
//     backgroundColor: '#22978DA9',
//     // color: '#212529',
//     color : '#FFFFFF' ,
//     maxWidth: '4450px', // Ajustar el ancho máximo
//     width: '80%', // Ajustar el ancho al 80% del contenedor
//   },
// };

// Modal.setAppElement('#root');

// const Motivacion = ({ isOpen, onRequestClose, message }) => {
//   const fadeIn = useSpring({
//     opacity: isOpen ? 1 : 0,
//     transform: isOpen ? 'translateY(0)' : 'translateY(-50%)'
//   });

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       style={customStyles}
//     >
//       <animated.div style={fadeIn}>
//         <button className="close-button" onClick={onRequestClose}>×</button>
//         <h2>Mensaje de Motivación</h2>
//         <p>{message}</p>
//       </animated.div>
//     </Modal>
//   );
// };

// export default Motivacion;
import React from 'react';
import Modal from 'react-modal';
import { useSpring, animated } from 'react-spring';
import './Motivacion.css';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    margin: 'auto',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    backgroundColor: '#22978DA9',
    color: '#FFFFFF',
    maxWidth: '450px',
    width: '80%',
    overflow: 'hidden',
  },
};

Modal.setAppElement('#root');

const Motivacion = ({ isOpen, onRequestClose, message }) => {
  const fadeIn = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-50%)',
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      className="motivacion-modal"
    >
      <animated.div style={fadeIn}>
        <button className="close-button" onClick={onRequestClose}>
          &times;
        </button>
        <p>{message}</p>
      </animated.div>
    </Modal>
  );
};

export default Motivacion;
