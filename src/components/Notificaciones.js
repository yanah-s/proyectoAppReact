import React, { useEffect, useState } from 'react';
import api from '../configuracion/axiosconfig';
import { Badge, Stack, Toolbar, Popover, Box, Typography, Paper } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from 'react-router-dom';

const Notificaciones = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);
    
        try {
            await api.post('/api/notificaciones/markAsRead', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const usuario = JSON.parse(localStorage.getItem('usuario')); 
                const response = await api.get('/api/notificaciones', {

                    headers: {
                        'Authorization': `Bearer ${token}`,   
                        'User-ID': usuario.id
                      }
                });
                setNotifications(response.data);
                setUnreadCount(response.data.length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 60000);

        return () => clearInterval(intervalId);
    }, []);



    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (notification) => {
        // Verifica el contenido del mensaje de la notificación
        const admin = localStorage.getItem('admin') === 'true';
        if (notification.message.includes('agendo')) {
            navigate('/ListarUsuarios');
        }
        if (notification.message.includes('rutina') && !admin ) {
            navigate('/verRutinas');  
        }
        if (notification.message.includes('rutina') && admin) {
            navigate('/rutinas');  
        }
        if (notification.message.includes('objetivos') && !admin) {
            navigate('/objetivos-metas');  
        } 
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

return (
    <div>
        <Toolbar style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <Stack spacing={4} direction="row" sx={{ alignItems: 'center' }}>
                <Badge color="secondary" badgeContent={unreadCount} onClick={handleClick} sx={{ cursor: 'pointer' }}>
                    <MailIcon sx={{ color: 'white' }} />
                </Badge>
            </Stack>
        </Toolbar>
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
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <Paper key={notification.id} sx={{ p: 1, mb: 1 }} onClick={() => handleNotificationClick(notification)}>
                                <Typography variant="body1">
                                    {notification.message}
                                </Typography>
                            </Paper>
                        ))
                    ) : (
                        <Typography variant="body1">No tienes nuevas notificaciones.</Typography>
                    )}
            </Box>
        </Popover>
    </div>
);
};

export default Notificaciones;
