import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';

interface SettingsData {
  dateSettings: { currentDate: string; allowDateChange: boolean };
  billSettings: { billPrefix: string; autoNumber: boolean };
  userSettings: { username: string; role: string }[];
}

const SettingsPage: React.FC = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [section, setSection] = useState<'date' | 'bill' | 'user'>('date');

  useEffect(() => {
    fetch('/data/settings.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <Typography variant="h5" sx={{ color: '#009688', mb: 2 }}>Settings</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant={section === 'date' ? 'contained' : 'outlined'} 
          onClick={() => setSection('date')}
          sx={{ color: section === 'date' ? '#fff' : '#00796b', fontWeight: 700 }}
        >Date Settings</Button>
        <Button 
          variant={section === 'bill' ? 'contained' : 'outlined'} 
          onClick={() => setSection('bill')}
          sx={{ color: section === 'bill' ? '#fff' : '#00796b', fontWeight: 700 }}
        >Bill Settings</Button>
        <Button 
          variant={section === 'user' ? 'contained' : 'outlined'} 
          onClick={() => setSection('user')}
          sx={{ color: section === 'user' ? '#fff' : '#00796b', fontWeight: 700 }}
        >User Settings</Button>
      </Box>
      {data ? (
        <div>
          {section === 'date' && (
            <Box sx={{ mb: 2 }}>
              <Typography>Date: {data.dateSettings.currentDate}</Typography>
              <Typography>Allow Date Change: {data.dateSettings.allowDateChange ? 'Yes' : 'No'}</Typography>
            </Box>
          )}
          {section === 'bill' && (
            <Box sx={{ mb: 2 }}>
              <Typography>Bill Prefix: {data.billSettings.billPrefix}</Typography>
              <Typography>Auto Number: {data.billSettings.autoNumber ? 'Yes' : 'No'}</Typography>
            </Box>
          )}
          {section === 'user' && (
            <Box>
              <Typography>User List:</Typography>
              <ul>
                {data.userSettings.map((u, idx) => (
                  <li key={idx}>{u.username} ({u.role})</li>
                ))}
              </ul>
            </Box>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SettingsPage;
