import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
Paper, Typography, Dialog, DialogActions , DialogContent, DialogContentText, DialogTitle , Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useNavigate} from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Icono de Material-UI para el menú hamburguesa
import EditIcon from '@mui/icons-material/Edit'; // Icono de Material-UI para editar
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from '../configuracion/axiosconfig';

const ConfirmDialog = ({ open, handleClose, handleConfirm, title, content }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} style={{ color: tema.palette.error.main }}>
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} style={{ color: tema.palette.success.main }} autoFocus>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const tema = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#424242',
        },
        secondary: {
            main: '#757575',
        },
        error: {
            main: '#ff5252',
        },
        background: {
            default: '#121212',
            paper: '#1d1d1d',
        },
        text: {
            primary: '#ffffff',
            secondary: '#bdbdbd',
        },
    },
    typography: {
        h4: {
            fontSize: '2rem',
            color: '#e0e0e0',
        },
    },
});

const HamburgerMenu = ({ loading, onEditClick, onDeleteClick, onStudentClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                color="primary"
                aria-label="menu"
                onClick={handleClick}
                disabled={loading}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { handleClose(); onEditClick(); }}>
                    <EditIcon style={{ marginRight: 8 }} />
                    Editar
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); onDeleteClick(); }}>
                    <DeleteIcon style={{ marginRight: 8 }} />
                    Eliminar
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); onStudentClick(); }}>
                    <CheckCircleIcon style={{ marginRight: 8 }} />
                    Asignar Alumno
                </MenuItem>
            </Menu>
        </div>
    );
};

const ListarUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [openAssign, setOpenAssign] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        console.log(localStorage);
        traerUsuarios();
    }, []);

    const handleClickOpenDelete = (id) => {
        setSelectedId(id);
        setOpenDelete(true);
    };

    const handleClickOpenAssign = (id) => {
        setSelectedId(id);
        setOpenAssign(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedId(null);
    };

    const handleCloseAssign = () => {
        setOpenAssign(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = () => {
        if (selectedId !== null) {
            eliminarUsuario(selectedId);
            handleCloseDelete();
        }
    };

    const handleConfirmAssign = () => {
        if (selectedId !== null) {
            asignarAlumno(selectedId);
            handleCloseAssign();
        }
    };

    const eliminarUsuario = async (id) => {
        try {
            const token = localStorage.getItem('token'); 
            const usuario = JSON.parse(localStorage.getItem('usuario')); 
            const respuesta = await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'User-ID': usuario.id
                }
              });
            console.log(respuesta);
            setUsuarios(usuarios.filter(usuario => usuario.id !== id));
        } catch (err) {
            console.log(err);
        }
    };


    const asignarAlumno = async (id) => {
        try {
            const token = localStorage.getItem('token'); 
            const usuario = JSON.parse(localStorage.getItem('usuario')); 
            const respuesta = await axios.put(`http://localhost:3000/api/usuarios/asignar/${id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'User-ID': usuario.id
                }
              });
            console.log(respuesta);
        } catch (err) {
            console.log(err);
        }
    };

  
    const traerUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token'); 
            const usuario = JSON.parse(localStorage.getItem('usuario')); 
            const respuesta = await axios.get('http://localhost:3000/api/usuarios', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'User-ID': usuario.id
                }
              });
            setUsuarios(respuesta.data);
        } catch (err) {
            console.error('Error:', err);
            let errorMsg = 'Error de conexión';
            if (err.response) {
                if (err.response.data && err.response.data.mensaje) {
                    errorMsg = err.response.data.mensaje;
                } else if (err.response.data && err.response.data.error) {
                    errorMsg = err.response.data.error;
                } else if (err.response.data && err.response.data.message) {
                    errorMsg = err.response.data.message;
                } else {
                    errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
                }
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const mostrarAlumno = (alumno) => {
        return alumno ? 'Sí' : 'No';
    };

    const handleEditClick = (id) => {
        navigate(`.././EditarUsuarioDesdeAdmin/${id}`);
    };

    return (
        <ThemeProvider theme={tema}>
            <div style={{ backgroundColor: tema.palette.background.default, minHeight: '100vh', padding: '20px' }}>
                <Container maxWidth="lg" disableGutters>
                    <Paper style={{ backgroundColor: tema.palette.background.paper, border: 'none' }}>
                        
                    {error && (
                <Typography color="error">
                  {error}
                </Typography>
              )}
              {mensaje && <Typography color="success.main">{mensaje}</Typography>}
           
                        
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Nombre</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Email</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Alumno</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Observaciones</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Patologias</TableCell>
                                        
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usuarios.map((usuario) => (
                                        <TableRow key={usuario._id}>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.nombre}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.email}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{mostrarAlumno(usuario.alumno)}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.observaciones}</TableCell>
                                            <TableCell style={{ color: tema.palette.text.primary }}>{usuario.patologias}</TableCell>
                                            <TableCell>
                                                <HamburgerMenu
                                                    loading={loading}
                                                    onEditClick={() => handleEditClick(usuario._id)}
                                                    onDeleteClick={() => handleClickOpenDelete(usuario._id)}
                                                    onStudentClick={() => handleClickOpenAssign(usuario._id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <ConfirmDialog
                                open={openDelete}
                                handleClose={handleCloseDelete}
                                handleConfirm={handleConfirmDelete}
                                title="Confirmación"
                                content="¿Estás seguro de que deseas eliminar este usuario?"
                            />
                            <ConfirmDialog
                                open={openAssign}
                                handleClose={handleCloseAssign}
                                handleConfirm={handleConfirmAssign}
                                title="Confirmación"
                                content="¿Estás seguro de que deseas asignar este alumno?"
                            />
                        </TableContainer>
                    </Paper>
                </Container>
            </div>
        </ThemeProvider>
    );
};

export default ListarUsuarios;