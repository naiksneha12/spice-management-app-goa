import React, { useState, useEffect } from 'react';
import './MasterForm.css';

interface Customer {
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  customerGST: string;
  customerVat: string;
  customerDiscountPercent: number;
  customerCreditDays: number;
  customerAmount: number;
  lockBilling: boolean;
  customerPackage: string[];
}

const defaultCustomer: Customer = {
  customerId: '',
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  customerEmail: '',
  customerGST: '',
  customerVat: '',
  customerDiscountPercent: 0,
  customerCreditDays: 0,
  customerAmount: 0,
  lockBilling: false,
  customerPackage: []
};

const CustomerMasterForm = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<Customer>(defaultCustomer);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [allPackages, setAllPackages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/masters/customerMaster.json')
      .then(res => res.json())
      .then(setCustomers);
    fetch('/data/masters/customerPackageMaster.json')
      .then(res => res.json())
      .then((data: { packageName: string }[]) => setAllPackages(data.map(p => p.packageName)));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type, multiple } = target;
    if (type === 'checkbox' && 'checked' in target) {
      setForm(prev => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
    } else if (multiple && target instanceof HTMLSelectElement) {
      const selected: string[] = [];
      for (let i = 0; i < target.options.length; i++) {
        if (target.options[i].selected) selected.push(target.options[i].value);
      }
      setForm(prev => ({ ...prev, [name]: selected }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...customers];
      updated[editIndex] = form;
      setCustomers(updated);
      setEditIndex(null);
    } else {
      setCustomers([...customers, form]);
    }
    setForm(defaultCustomer);
  };

  const handleEdit = (idx: number) => {
    setForm(customers[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setCustomers(customers.filter((_, i) => i !== idx));
    setForm(defaultCustomer);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>Customer Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerId">Customer ID</label>
            <input id="customerId" name="customerId" value={form.customerId} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="customerName">Customer Name</label>
            <input id="customerName" name="customerName" value={form.customerName} onChange={handleChange} required type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerAddress">Address</label>
            <input id="customerAddress" name="customerAddress" value={form.customerAddress} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="customerPhone">Phone</label>
            <input id="customerPhone" name="customerPhone" value={form.customerPhone} onChange={handleChange} type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerEmail">Email</label>
            <input id="customerEmail" name="customerEmail" value={form.customerEmail} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="customerGST">GST Number</label>
            <input id="customerGST" name="customerGST" value={form.customerGST} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="customerVat">VAT Number</label>
            <input id="customerVat" name="customerVat" value={form.customerVat} onChange={handleChange} type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerDiscountPercent">Discount %</label>
            <input id="customerDiscountPercent" name="customerDiscountPercent" value={form.customerDiscountPercent} onChange={handleChange} type="number" />
          </div>
          <div className="form-group">
            <label htmlFor="customerCreditDays">Credit Days</label>
            <input id="customerCreditDays" name="customerCreditDays" value={form.customerCreditDays} onChange={handleChange} type="number" />
          </div>
          <div className="form-group">
            <label htmlFor="customerAmount">Amount</label>
            <input id="customerAmount" name="customerAmount" value={form.customerAmount} onChange={handleChange} type="number" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="customerPackage">Packages</label>
            <select id="customerPackage" name="customerPackage" value={form.customerPackage} onChange={handleChange} multiple>
              {allPackages.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="lockBilling" style={{marginRight: 8}}>
              <input id="lockBilling" name="lockBilling" type="checkbox" checked={form.lockBilling} onChange={handleChange} /> Lock Billing
            </label>
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Customer</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Amount</th><th>Lock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr key={c.customerId}>
              <td>{c.customerId}</td>
              <td>{c.customerName}</td>
              <td>{c.customerPhone}</td>
              <td>{c.customerEmail}</td>
              <td>{c.customerAmount}</td>
              <td>{c.lockBilling ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(idx)}>Edit</button>
                <button onClick={() => handleDelete(idx)} style={{marginLeft: 8}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerMasterForm;
