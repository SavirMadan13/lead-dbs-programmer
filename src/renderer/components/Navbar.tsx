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
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// import { FaHamburger, FaSun, FaMoon } from 'react-icons/fa';

// eslint-disable-next-line import/prefer-default-export
export default function Navbar({ text, text2, color1, color2 }) {
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
    <div>
      {/* <AppBar position="fixed" style={{ backgroundColor: color1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {text}
          </Typography>
          {isMobile ? (
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
        )}
        </Toolbar>
      </AppBar> */}
      <AppBar position="fixed" style={{ backgroundColor: color1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {text}
          </Typography>
          {/* Add any additional elements for the first row here */}
        </Toolbar>
      </AppBar>
      {color2 && (
        <AppBar
          position="fixed"
          style={{ backgroundColor: color2, top: 'auto', marginTop: '-140px' }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: 'black',  }}>
              {text2}
            </Typography>
            {/* Add any additional elements for the second row here */}
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
}
