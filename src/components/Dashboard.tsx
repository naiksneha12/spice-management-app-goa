import React from 'react';
import './Dashboard.css';
import type { Bill } from './Billing';

interface DashboardProps {
  billHistory: Bill[];
}

const Dashboard: React.FC<DashboardProps> = ({ billHistory }) => {
  const salesData = [
    { month: 'January', sales: 1200 },
    { month: 'February', sales: 1500 },
    { month: 'March', sales: 1100 },
  ];
  const totalSales = salesData.reduce((sum, row) => sum + row.sales, 0);
  const bestMonth = salesData.reduce((best, row) => row.sales > best.sales ? row : best, salesData[0]);

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
      <div className="dashboard-card">
        <div className="dashboard-title">Sales Dashboard</div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Sales (₹)</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>₹{row.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default Dashboard;
