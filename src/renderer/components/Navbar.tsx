/**
 * Navigation Bar Component
 * 
 * This component provides the main navigation bar for the application.
 * It supports both single and dual-row layouts with customizable colors and text.
 */

import React, { useState } from 'react';
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
import { NavLink } from 'react-router-dom';

/**
 * Props interface for the Navbar component
 */
interface NavbarProps {
  /** Primary text to display in the main navigation bar */
  text: string;
  /** Secondary text to display in the second navigation bar (optional) */
  text2?: string;
  /** Primary color for the main navigation bar */
  color1: string;
  /** Secondary color for the second navigation bar (optional) */
  color2?: string;
  /** Additional CSS class name for styling */
  className?: string;
}

/**
 * Navigation Bar Component
 * 
 * Provides a responsive navigation bar with support for dual-row layouts.
 * The component automatically adjusts for mobile devices and provides a clean,
 * professional appearance.
 */
export default function Navbar({ 
  text, 
  text2, 
  color1, 
  color2, 
  className 
}: NavbarProps): JSX.Element {
  // State management
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Theme and responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Toggle the mobile drawer open/closed state
   * @param open - Whether the drawer should be open
   */
  const toggleDrawer = (open: boolean): void => {
    setDrawerOpen(open);
  };

  /**
   * Render navigation menu items
   * Currently contains commented-out menu items for future use
   */
  const renderMenuItems = (): JSX.Element => (
    <>
      {/* Future menu items can be added here */}
      {/* Example:
      <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <IconButton>
          <Typography>Home</Typography>
        </IconButton>
      </NavLink>
      */}
    </>
  );

  /**
   * Render the main navigation bar
   */
  const renderMainAppBar = (): JSX.Element => (
    <AppBar 
      position="fixed" 
      style={{ backgroundColor: color1 }}
      className={className}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            textAlign: 'center', 
            fontSize: '24px', 
            fontWeight: 'bold' 
          }}
        >
          {text}
        </Typography>
        {/* Additional elements can be added here */}
      </Toolbar>
    </AppBar>
  );

  /**
   * Render the secondary navigation bar (if color2 and text2 are provided)
   */
  const renderSecondaryAppBar = (): JSX.Element | null => {
    if (!color2 || !text2) {
      return null;
    }

    return (
      <AppBar
        position="fixed"
        style={{ 
          backgroundColor: color2, 
          top: 'auto', 
          marginTop: '-140px' 
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center', 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'black' 
            }}
          >
            {text2}
          </Typography>
          {/* Additional elements can be added here */}
        </Toolbar>
      </AppBar>
    );
  };

  /**
   * Render mobile drawer for responsive navigation
   */
  const renderMobileDrawer = (): JSX.Element => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <List>
        <ListItem>
          {renderMenuItems()}
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <div>
      {/* Main navigation bar */}
      {renderMainAppBar()}
      
      {/* Secondary navigation bar (if provided) */}
      {renderSecondaryAppBar()}
      
      {/* Mobile drawer (if needed for future menu items) */}
      {isMobile && renderMobileDrawer()}
    </div>
  );
}