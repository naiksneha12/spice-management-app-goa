import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, Switch, FormControlLabel, Paper, Divider, MenuItem, Snackbar, Alert } from '@mui/material';

interface SettingsData {
  dateSettings: { currentDate: string; allowDateChange: boolean };
  billSettings: { billPrefix: string; autoNumber: boolean; vatPercent?: number; gstPercent?: number };
  userSettings: { username: string; role: string }[];
}

const SettingsPage: React.FC = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [section, setSection] = useState<'date' | 'bill' | 'user'>('date');
  const [date, setDate] = useState('');
  const [allowDateChange, setAllowDateChange] = useState(false);
  const [billPrefix, setBillPrefix] = useState('');
  const [autoNumber, setAutoNumber] = useState(false);
  const [vatPercent, setVatPercent] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    fetch('/data/settings.json')
      .then(res => res.json())
      .then((d: SettingsData) => {
        setData(d);
        setDate(d.dateSettings.currentDate);
        setAllowDateChange(d.dateSettings.allowDateChange);
        setBillPrefix(d.billSettings.billPrefix);
        setAutoNumber(d.billSettings.autoNumber);
        setVatPercent(d.billSettings.vatPercent || 0);
        setGstPercent(d.billSettings.gstPercent || 0);
      });
  }, []);

  const handleSaveDate = () => {
    if (!date) return;
    setShowSnackbar(true);
    // Here you would POST to backend or update file
    setData(prev => prev ? ({ ...prev, dateSettings: { currentDate: date, allowDateChange } }) : prev);
  };

  const handleSaveBill = () => {
    setShowSnackbar(true);
    setData(prev => prev ? ({ ...prev, billSettings: { ...prev.billSettings, billPrefix, autoNumber, vatPercent, gstPercent } }) : prev);
  };

  const handlePasswordChange = () => {
    if (!password || password.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordMsg('Passwords do not match.');
      return;
    }
    setPasswordMsg('Password updated successfully!');
    setPassword('');
    setConfirmPassword('');
    setShowSnackbar(true);
  };

  return (
    <Box sx={{ p: 4, ml: { xs: 0, sm: 6 }, maxWidth: 700 }}>
      <Typography variant="h4" sx={{ color: '#009688', mb: 3, fontWeight: 700 }}>Settings</Typography>
      <Paper elevation={2} sx={{ mb: 3, p: 2, display: 'flex', gap: 2, justifyContent: 'center', background:"#327666" }}>
        <Button variant={section === 'date' ? 'contained' : 'outlined'} onClick={() => setSection('date')}>Date Settings</Button>
        <Button variant={section === 'bill' ? 'contained' : 'outlined'} onClick={() => setSection('bill')}>Bill Settings</Button>
        <Button variant={section === 'user' ? 'contained' : 'outlined'} onClick={() => setSection('user')}>User Settings</Button>
      </Paper>
      <Divider sx={{ mb: 3 }} />
      {data ? (
        <>
          {section === 'date' && (
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Change Date</Typography>
              <TextField
                label="Current Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2, mr: 2 }}
              />
              <FormControlLabel
                control={<Switch checked={allowDateChange} onChange={e => setAllowDateChange(e.target.checked)} />}
                label="Allow Date Change"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleSaveDate}>Save Date Settings</Button>
            </Paper>
          )}
          {section === 'bill' && (
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Bill Settings</Typography>
              <TextField
                label="Bill Prefix"
                value={billPrefix}
                onChange={e => setBillPrefix(e.target.value)}
                sx={{ mb: 2, mr: 2 }}
              />
              <FormControlLabel
                control={<Switch checked={autoNumber} onChange={e => setAutoNumber(e.target.checked)} />}
                label="Auto Number"
                sx={{ mb: 2 }}
              />
              <TextField
                label="VAT %"
                type="number"
                value={vatPercent}
                onChange={e => setVatPercent(Number(e.target.value))}
                sx={{ mb: 2, mr: 2 }}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="GST %"
                type="number"
                value={gstPercent}
                onChange={e => setGstPercent(Number(e.target.value))}
                sx={{ mb: 2, mr: 2 }}
                inputProps={{ min: 0, max: 100 }}
              />
              <Button variant="contained" onClick={handleSaveBill}>Save Bill Settings</Button>
            </Paper>
          )}
          {section === 'user' && (
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                sx={{ mb: 2, mr: 2 }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                sx={{ mb: 2, mr: 2 }}
              />
              <Button variant="contained" onClick={handlePasswordChange}>Update Password</Button>
              {passwordMsg && <Typography sx={{ color: passwordMsg.includes('success') ? 'green' : 'red', mt: 1 }}>{passwordMsg}</Typography>}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>User List</Typography>
              <ul style={{ paddingLeft: 20 }}>
                {data.userSettings.map((u, idx) => (
                  <li key={idx}>{u.username} ({u.role})</li>
                ))}
              </ul>
            </Paper>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
      <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={() => setShowSnackbar(false)}>
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Settings saved!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
