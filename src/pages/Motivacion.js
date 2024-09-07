
import React from 'react';
import Modal from 'react-modal';
import { useSpring, animated } from 'react-spring';
import './Motivacion.css';

// const customStyles = {
//   overlay: {
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     position: 'relative',
//     top: 'auto',
//     left: 'auto',
//     right: 'auto',
//     bottom: 'auto',
//     margin: 'auto',
//     padding: '20px',
//     borderRadius: '10px',
//     textAlign: 'center',
//     backgroundColor: '#22978DA9',
//     color: '#FFFFFF',
//     maxWidth: '450px',
//     width: '80%',
//     overflow: 'hidden',
//   },
// };

// Modal.setAppElement('#root');

// const Motivacion = ({ isOpen, onRequestClose, message }) => {
//   const fadeIn = useSpring({
//     opacity: isOpen ? 1 : 0,
//     transform: isOpen ? 'translateY(0)' : 'translateY(-50%)',
//   });

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       style={customStyles}
//       className="motivacion-modal"
//     >
//       <animated.div style={fadeIn}>
//         <button className="close-button" onClick={onRequestClose}>
//           &times;
//         </button>
//         <p>{message}</p>
//       </animated.div>
//     </Modal>
//   );
// };

// export default Motivacion;



// const customStyles = {
//   overlay: {
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000, 
//   },
//   content: {
//     padding: '20px',
//     borderRadius: '10px',
//     textAlign: 'center',
//     backgroundColor: '#22978DA9',
//     color: '#FFFFFF',
//     maxWidth: '450px',
//     width: '80%',
//     zIndex: 1001,
//   },
// };
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Asegúrate de que el modal esté encima de otros elementos
  },
  content: {
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    backgroundColor: '#22978DA9',
    color: '#FFFFFF',
    maxWidth: '90%', // Ajusta el ancho máximo del modal
    width: 'auto', // Ajusta el ancho para adaptarse al contenido
    maxHeight: '80vh', // Ajusta la altura máxima para evitar que el modal sea demasiado alto
    overflow: 'auto', // Agrega scroll si el contenido es muy grande
    position: 'relative',
    margin: '0 auto', // Centra el modal horizontalmente
  },
};

Modal.setAppElement('#root');

const Motivacion = ({ isOpen, onRequestClose, message }) => {
  console.log('Modal received props:', { isOpen, message });

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    className="motivacion-modal"
    overlayClassName="motivacion-overlay"
  >
    <div className="motivacion-content">
      <button
        onClick={onRequestClose}
        className="close-button"
      >
        &times;
      </button>
      <p>{message}</p>
    </div>
  </Modal>
  );
};

export default Motivacion;