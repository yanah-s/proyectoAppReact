import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Stack, Toolbar, Popover, Box, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

const Notificaciones = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);
    
        try {
            await axios.post('http://localhost:3000/api/notificaciones/markAsRead', {}, {
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
                const response = await axios.get('http://localhost:3000/api/notificaciones', {
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

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        // <div>
        //     <Toolbar style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        //         <Stack spacing={4} direction="row" sx={{ alignItems: 'center' }}>
        //             <Badge color="secondary" badgeContent={unreadCount} onClick={handleClick} sx={{ cursor: 'pointer' }}>
        //                 <MailIcon sx={{ color: 'white' }} />
        //             </Badge>
        //         </Stack>
        //     </Toolbar>
        //     <Popover
        //         id={id}
        //         open={open}
        //         anchorEl={anchorEl}
        //         onClose={handleClose}
        //         anchorOrigin={{
        //             vertical: 'bottom',
        //             horizontal: 'right',
        //         }}
        //         transformOrigin={{
        //             vertical: 'top',
        //             horizontal: 'right',
        //         }}
        //     >
        //         <Box sx={{ p: 2 }}>
        //             <Typography variant="h6">Notificaciones</Typography>
        //             {notifications> (
        //                 notifications.map((notification) => (
        //                     <Typography key={notification.id} variant="body1">
        //                         {notification.message}
        //                     </Typography>
        //                 ))
        //             // ) 
        //             )}
        //         </Box>
        //     </Popover>
        // </div>
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
                        <Typography key={notification.id} variant="body1">
                            {notification.message}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="body1">No hay nuevas notificaciones.</Typography>
                )}
            </Box>
        </Popover>
    </div>
    );
};

export default Notificaciones;
