// Sidebar.js

import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Home as HomeIcon, TrendingUp as TrendingUpIcon, Equalizer as EqualizerIcon } from '@mui/icons-material';
// import { useTheme } from '../Components/ThemeContext';


const Sidebar = () => {
    // const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getIconColor = () => ('#708090' );

  const sidebarItems = [
    { label: 'Home', icon: <HomeIcon color={getIconColor()} /> },
    { label: 'Trending', icon: <TrendingUpIcon color={getIconColor()} /> },
    { label: 'Statistics', icon: <EqualizerIcon color={getIconColor()} /> },
  ];

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: isHovered ? 240 : 60,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: isHovered ? 240 : 60,
          background: `linear-gradient(to bottom, #2F4F4F, #2c3e50)`,
        //   color: theme === 'dark' ? '#fff' : '#2F3349',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <List sx={{ marginTop: 'auto' }}>
        {sidebarItems.map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
