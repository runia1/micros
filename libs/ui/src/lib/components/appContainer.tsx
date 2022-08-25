import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Dashboard, AccountCircle } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useUserContext } from '../hooks/useUserContext';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const drawerWidth = 180;

export default function AppContainer(props: any) {
    const { children } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showLoggedOutDialog, setShowLoggedOutDialog] = useState(false);
    const user = useUserContext();
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            setShowLoggedOutDialog(true);
        } else {
            setShowLoggedOutDialog(false);
        }
    }, [user]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMyAccountClose = () => {
        setAnchorEl(null);
    };

    const handleLoginAndComeBack = () => {
        router.replace(`/login?redirect=${router.pathname}`);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {/* Everyone can see the dashboard, no perm check needed */}
                <Link href="/dashboard" passHref>
                    <ListItem button>
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                </Link>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Dialog
                open={showLoggedOutDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Looks like your session has expired!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Click the button to login and we&apos;ll bring you right
                        back here.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleLoginAndComeBack}>
                        Log Back In
                    </Button>
                </DialogActions>
            </Dialog>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ ml: '5px', flexGrow: 1 }}
                    >
                        Some Product Name
                    </Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        onClick={(event: React.MouseEvent<HTMLElement>) =>
                            setAnchorEl(event.currentTarget)
                        }
                    >
                        <AccountCircle sx={{ pr: '5px' }} />
                        My Account
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMyAccountClose}
                    >
                        <Link href="/users/edit" passHref>
                            <MenuItem onClick={handleMyAccountClose}>
                                Profile
                            </MenuItem>
                        </Link>
                        <MenuItem
                            onClick={() =>
                                (window.location.href = '/api/logout')
                            }
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
