import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import StimulationSettings from './StimulationSettings';
import AssistedToggle from './AssistedToggle';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// import { FaHamburger, FaSun, FaMoon } from 'react-icons/fa';

// eslint-disable-next-line import/prefer-default-export
export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const menuItems = (
    <>
      {/* <NavLink
        to="/testing"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Component Testing</Typography>
        </IconButton>
      </NavLink> */}
      {/* <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <IconButton>
          <Typography>Setup</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/tabbed-selection"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Electrode Model</Typography>
        </IconButton>
      </NavLink> */}
      {/* <NavLink
        to="/end-session"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Finish Session</Typography>
        </IconButton>
      </NavLink> */}
      {/* {isDarkMode ? (
        <Button onClick={toggleTheme}>
          <FaSun style={{ color: 'yellow' }} />
        </Button>
      ) : (
        <Button onClick={toggleTheme} style={{ color: 'blue' }}>
          <FaMoon />
        </Button>
      )} */}
    </>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Lead-DBS Programmer
        </Typography>
        {/* {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => toggleDrawer(true)}>
              Button
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClick={() => toggleDrawer(false)}
            >
              <List>
                <ListItem>{menuItems}</ListItem>
              </List>
            </Drawer>
          </>
        ) : (
          menuItems
        )} */}
      </Toolbar>
      {/* <StimulationSettings /> */}
    </AppBar>
  );
}
