import React from 'react';
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  IconButton,
  Divider,
  Badge,
  CircularProgress,
  Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { format } from 'date-fns';

const NotificationMenu = ({ 
  anchorEl, 
  open, 
  onClose, 
  notifications = [], 
  loading = false,
  error = null 
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <NotificationsActiveIcon color="success" />;
      case 'error':
        return <NotificationsOffIcon color="error" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: 480,
          mt: 1.5,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Notifications</Typography>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </Box>
      <Divider />
      <List sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : notifications.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No notifications"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            />
          </ListItem>
        ) : (
          notifications.map((notification, index) => (
            <React.Fragment key={notification._id}>
              <ListItem
                sx={{
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                }}
              >
                <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block' }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Popover>
  );
};

export default NotificationMenu; 