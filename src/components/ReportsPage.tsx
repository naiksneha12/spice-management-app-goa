import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import './Dashboard.css';

interface ReportRow {
  date: string;
  total: number;
  items?: number;
  customer?: string;
  supplier?: string;
}

interface ReportsData {
  salesReport: ReportRow[];
  purchaseReport: ReportRow[];
  salesReturnReport: ReportRow[];
}

const ReportsPage: React.FC = () => {
  const [data, setData] = useState<ReportsData | null>(null);
  const [section, setSection] = useState<'sales' | 'purchase' | 'return'>('sales');

  useEffect(() => {
    fetch('/data/reports.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  const columns = {
    sales: ["Date", "Customer", "Items", "Total (₹)"],
    purchase: ["Date", "Supplier", "Items", "Total (₹)"],
    return: ["Date", "Customer", "Items", "Total (₹)"]
  };

  const getRows = () => {
    if (!data) return [];
    if (section === 'sales') return data.salesReport;
    if (section === 'purchase') return data.purchaseReport;
    return data.salesReturnReport;
  };

  return (
    <div style={{ padding: 32 }}>
      <Typography variant="h5" sx={{ color: '#009688', mb: 2 }}>Reports</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 , }}>
        <Button 
          variant={section === 'sales' ? 'contained' : 'outlined'} 
          onClick={() => setSection('sales')}
          sx={{ color: section === 'sales' ? '#fff' : '#00796b', fontWeight: 700 }}
        >Sales Report</Button>
        <Button 
          variant={section === 'purchase' ? 'contained' : 'outlined'} 
          onClick={() => setSection('purchase')}
          sx={{ color: section === 'purchase' ? '#fff' : '#00796b', fontWeight: 700 }}
        >Purchase Report</Button>
        <Button 
          variant={section === 'return' ? 'contained' : 'outlined'} 
          onClick={() => setSection('return')}
          sx={{ color: section === 'return' ? '#fff' : '#00796b', fontWeight: 700 }}
        >Sales Return Report</Button>
      </Box>
      {data ? (
        <table className="master-table" style={{ maxWidth: 700 }}>
          <thead>
            <tr>
              {columns[section].map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {getRows().map((row, idx) => (
              <tr key={idx}>
                <td>{row.date}</td>
                {section === 'sales' || section === 'return' ? <td>{row.customer || '-'}</td> : <td>{row.supplier || '-'}</td>}
                <td>{row.items ?? '-'}</td>
                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ReportsPage;
