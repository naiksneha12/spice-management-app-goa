import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import type { Bill } from './Billing';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MixSales { name: string; quantity: number; }
interface SalesMonth { month: string; sales: number; }

const Dashboard: React.FC<{ billHistory: Bill[] }> = ({ billHistory }) => {
  const [salesData, setSalesData] = useState<SalesMonth[]>([]);
  const [mixSalesArr, setMixSalesArr] = useState<MixSales[]>([]);

  useEffect(() => {
    fetch('/data/sales.json')
      .then(res => res.json())
      .then(setSalesData);
    fetch('/data/mixSales.json')
      .then(res => res.json())
      .then(setMixSalesArr);
  }, []);

  const totalSales = salesData.reduce((sum, row) => sum + row.sales, 0);
  const bestMonth = salesData.reduce((best, row) => row.sales > best.sales ? row : best, salesData[0] || { month: '', sales: 0 });

  // Find best and poor seller
  const bestSeller = mixSalesArr.reduce((best, curr) => curr.quantity > best.quantity ? curr : best, { name: '', quantity: 0 });
  const poorSeller = mixSalesArr.reduce((poor, curr) => curr.quantity < poor.quantity ? curr : poor, { name: '', quantity: Infinity });

  // Filter today's bills
  const today = new Date().toLocaleDateString();
  const todaysBills = billHistory.filter(bill => bill.date === today);

  return (
    <div className="dashboard-bg">
      <div className="dashboard-widgets">
        <div className="dashboard-widget">
          <div className="dashboard-widget-title">Total Sales</div>
          <div className="dashboard-widget-value">₹{totalSales}</div>
        </div>
        <div className="dashboard-widget">
          <div className="dashboard-widget-title">Best Month</div>
          <div className="dashboard-widget-value">{bestMonth.month}</div>
        </div>
        <div className="dashboard-widget">
          <div className="dashboard-widget-title">Months Tracked</div>
          <div className="dashboard-widget-value">{salesData.length}</div>
        </div>
      </div>
      <div className="dashboard-card dashboard-charts-row">
        <div style={{ width: 200, height: 200 }}>
          <div className="dashboard-title" style={{ fontSize: '1.05rem', marginBottom: 6, whiteSpace: 'nowrap' }}>Sales Per Month</div>
          <ResponsiveContainer width={200} height={200}>
            <BarChart data={salesData} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              {/* Hide CartesianGrid */}
              {/* <CartesianGrid strokeDasharray="3 3" stroke="#a1887f" /> */}
              <XAxis type="number" stroke="#058177ff" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis dataKey="month" type="category" stroke="#058177ff" fontSize={10} width={60} axisLine={false} tickLine={false} />
              <Tooltip wrapperStyle={{ fontSize: 10 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} iconSize={10} />
              <Bar dataKey="sales" fill="#058177ff" barSize={24} radius={[4,4,4,4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: 200, height: 200 }}>
          <div className="dashboard-title" style={{ fontSize: '1.05rem', marginBottom: 6, whiteSpace: 'nowrap' }}>Mix Best & Poor Seller</div>
          <ResponsiveContainer width={200} height={200}>
            <BarChart data={mixSalesArr} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              {/* Hide CartesianGrid */}
              {/* <CartesianGrid strokeDasharray="3 3" stroke="#a1887f" /> */}
              <XAxis dataKey="name" stroke="#058177ff" fontSize={10} interval={0} angle={-30} dy={10} height={40} axisLine={false} tickLine={false} />
              <YAxis stroke="#058177ff" fontSize={10} width={24} axisLine={false} tickLine={false} />
              <Tooltip wrapperStyle={{ fontSize: 10 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} iconSize={10} />
              <Bar dataKey="quantity" fill="#058177ff" barSize={24} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, marginTop: 4, color: '#058177ff', textAlign: 'center' }}>
            Best Seller: <b>{bestSeller.name || '-'}</b><br />
            Poor Seller: <b>{poorSeller.name || '-'}</b>
          </div>
        </div>
      </div>
      <div className="dashboard-card" style={{ marginTop: 32 }}>
        <div className="dashboard-title">Today's Bill History</div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Spice Mix</th>
              <th>Quantity</th>
              <th>Total (₹)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {todaysBills.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#a67c52' }}>No bills generated today.</td></tr>
            ) : (
              todaysBills.map((bill, idx) => (
                <tr key={idx}>
                  <td>{bill.name}</td>
                  <td>{bill.quantity}</td>
                  <td>₹{bill.total}</td>
                  <td>{bill.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <nav className="dashboard-menu">
        {/* ...existing menu items... */}
        <div className="dashboard-menu-item">
          <span
            className="dashboard-menu-link"
            style={{ cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0 }}
            onClick={() => window.dispatchEvent(new CustomEvent('dashboard:navigate', { detail: 'masters' }))}
          >
            Masters
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
