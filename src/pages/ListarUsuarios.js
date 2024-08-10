import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../configuracion/axiosconfig';
import './ListarUsuarios.css';

import {
    Alert,
    AlertTitle,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Paper,
    Box,
    Snackbar,
    Typography,
    Table,
    Dialog,
    DialogActions,
    TableBody,
    TableCell,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TableContainer,
    TableHead,
    TableRow,
    Container
} from '@mui/material';

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
            paper: '#212529'
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
    const [usuariosFiltrados, setFilteredUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [openAssign, setOpenAssign] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
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

    const handleConfirmDelete = async () => {
        if (selectedId !== null) {
            await eliminarUsuario(selectedId);
            handleCloseDelete();
            traerUsuarios();
        }
    };

    const handleConfirmAssign = async () => {
        if (selectedId !== null) {
            await asignarAlumno(selectedId);
            handleCloseAssign();
            traerUsuarios();
        }
    };

    const eliminarUsuario = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            const respuesta = await api.delete(`/api/usuarios/${id}`, {
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

    const asignarAlumno = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            const respuesta = await api.put(`/api/usuarios/asignar/${id}`, {
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
            const respuesta = await api.get('/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'User-ID': usuario.id
                }
            });

            setUsuarios(respuesta.data);
            setFilteredUsuarios(respuesta.data);
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

    const filtrarTabla = (e) => {
        const value = e.target.value;
        setFilter(value);
        if (value.length >= 2) {
            const filtered = usuarios.filter(usuario => {
                const nombre = usuario.nombre?.toLowerCase().includes(value.toLowerCase());
                const email = usuario.email.toLowerCase().includes(value.toLowerCase());

                return nombre || email;
            });
            setFilteredUsuarios(filtered);
        } else {
            setFilteredUsuarios(usuarios);
        }
    };

    return (
        <ThemeProvider theme={tema}>
            <CssBaseline />
            {/* <div style={{ backgroundColor: tema.palette.background.default, minHeight: '100vh' }}> */}
                <Container maxWidth="lg">
                    <Snackbar open={!!mensaje} autoHideDuration={6000} onClose={() => setMensaje(null)}>
                        <Alert onClose={() => setMensaje(null)} severity="info">
                            <AlertTitle>Información</AlertTitle>
                            {mensaje}
                        </Alert>
                    </Snackbar>
                    <Paper style={{ padding: '20px', marginTop: '20px', backgroundColor: tema.palette.background.paper }}>
                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* <Typography variant="h4" style={{ color: tema.palette.text.primary, margin: '20px' }}>Listado de usuarios</Typography> */}
                            <TextField
                                value={filter}
                                onChange={filtrarTabla}
                                variant="outlined"
                                placeholder="Buscar usuario"
                                sx={{ backgroundColor: tema.palette.background.paper, borderRadius: '5px', margin: '20px' }}
                                InputProps={{ style: { color: tema.palette.text.primary } }}
                            />
                        </Box>
                        <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table className="responsive-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Nombre</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Email</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Es Alumno</TableCell>
                                        <TableCell style={{ color: tema.palette.text.primary }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usuariosFiltrados.map(usuario => (
                                        <TableRow key={usuario._id}>
                                            <TableCell data-label="Nombre" style={{ color: tema.palette.text.primary }}>{usuario.nombre}</TableCell>
                                            <TableCell data-label="Email" style={{ color: tema.palette.text.primary }}>{usuario.email}</TableCell>
                                            <TableCell data-label="Es Alumno" style={{ color: tema.palette.text.primary }}>{mostrarAlumno(usuario.alumno)}</TableCell>
                                            <TableCell data-label="Acciones">
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
                        </TableContainer>
                    </Paper>
                </Container>
                <ConfirmDialog
                    open={openDelete}
                    handleClose={handleCloseDelete}
                    handleConfirm={handleConfirmDelete}
                    title="Confirmar Eliminación"
                    content="¿Estás seguro que deseas eliminar este usuario?"
                />
                <ConfirmDialog
                    open={openAssign}
                    handleClose={handleCloseAssign}
                    handleConfirm={handleConfirmAssign}
                    title="Asignar Alumno"
                    content="¿Estás seguro que deseas asignar este usuario como alumno?"
                />
            {/* </div> */}
        </ThemeProvider>
    );
};

export default ListarUsuarios;
