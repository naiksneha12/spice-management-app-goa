import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import SpiceMixDetails from './components/SpiceMixDetails';
import Billing from './components/Billing';
import MastersPage from './components/masters/MastersPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import type { Bill } from './components/Billing';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, Button } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StorageIcon from '@mui/icons-material/Storage';
import './App.css';

const drawerWidth = 220;

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
      paper: '#f8f5f2',
    },
    primary: {
      main: '#d3eae2ff', // lighter brown
      contrastText: '#03786eff',
    },
    secondary: {
      main: '#147159ff',
    },
    text: {
      primary: '#07706bff',
      secondary: '#056248ff',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, sans-serif',
  },
});

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
  { label: 'Inventory', icon: <InventoryIcon />, view: 'inventory' },
  { label: 'Accounting', icon: <ReceiptIcon />, view: 'billing' },
  { label: 'Masters', icon: <StorageIcon />, view: 'masters' },
  { label: 'Reports', icon: <AssessmentIcon />, view: 'reports' },
  { label: 'Settings', icon: <SettingsApplicationsIcon />, view: 'settings' },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'inventory' | 'details' | 'billing' | 'masters' | 'reports' | 'settings'>('dashboard');
  const [selectedMixId, setSelectedMixId] = useState<number | null>(null);
  const [billHistory, setBillHistory] = useState<Bill[]>([]);

  const handleNewBill = (bill: Bill) => {
    setBillHistory(prev => [...prev, bill]);
  };

  const handleLogin = (user: string) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === 'masters') setView('masters');
    };
    window.addEventListener('dashboard:navigate', handler);
    return () => window.removeEventListener('dashboard:navigate', handler);
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', bgcolor: 'background.default', overflow: 'hidden' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRight: '1px solid #1fccafff',
              minHeight: '100vh',
            },
          }}
        >
          <Toolbar sx={{ justifyContent: 'center', bgcolor: 'primary.main', minHeight: 64 }}>
            <SpaIcon sx={{ color: '#19bc8eff', mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#075751ff', fontWeight: 700 }}>
              Welcome
            </Typography>
          </Toolbar>
          <List sx={{ p: 0, flex: 1 }}>
            {navItems.map((item) => (
              <ListItem 
                key={item.label}
                disablePadding
                sx={{ width: '100%' }}
              >
                <Box
                  sx={{ width: '100%' }}
                  component="button"
                  onClick={() => setView(item.view as typeof view)}
                  style={{
                    background: view === item.view ? '#d2f6f7ff' : 'transparent',
                    color: view === item.view ? '#1fb698ff' : '#037c56ff',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  <ListItemIcon sx={{ color: '#066547ff', minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </Box>
              </ListItem>
            ))}
          </List>
          <Box sx={{ width: '100%', p: 2, pb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#00684cff', mb: 1 }}>
              User: <b>{currentUser}</b>
            </Typography>
            <Button variant="outlined" color="secondary" sx={{ borderColor: '#45a393ff', color: '#52a6a0ff', fontWeight: 600, width: '100%' }} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default', p: { xs: 1, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}>
          <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', color: 'text.primary', mb: 3, borderRadius: 2, boxShadow: 0 }}>
            <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', width: '100%' }}>
            {view === 'dashboard' && <Dashboard billHistory={billHistory} />}
            {view === 'inventory' && <Inventory onSelect={id => { setSelectedMixId(id); setView('details'); }} />}
            {view === 'details' && selectedMixId !== null && (
              <SpiceMixDetails id={selectedMixId} onBack={() => setView('inventory')} />
            )}
            {view === 'billing' && <Billing onNewBill={handleNewBill} />}
            {view === 'masters' && <MastersPage />}
            {view === 'reports' && <ReportsPage />}
            {view === 'settings' && <SettingsPage />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
