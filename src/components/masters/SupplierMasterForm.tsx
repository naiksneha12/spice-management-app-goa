import React, { useState, useEffect } from 'react';
import './MasterForm.css';

interface Supplier {
  supplierName: string;
  company: string;
  supplierPhone: string;
  supplierAddress: string;
  supplierGST: string;
  lockSupplier: boolean;
}

const defaultSupplier: Supplier = {
  supplierName: '',
  company: '',
  supplierPhone: '',
  supplierAddress: '',
  supplierGST: '',
  lockSupplier: false
};

const SupplierMasterForm = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState<Supplier>(defaultSupplier);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/masters/supplierMaster.json')
      .then(res => res.json())
      .then(setSuppliers);
    fetch('/data/masters/companyMaster.json')
      .then(res => res.json())
      .then(data => setCompanies(data.map((c: any) => c.companyName)));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...suppliers];
      updated[editIndex] = form;
      setSuppliers(updated);
      setEditIndex(null);
    } else {
      setSuppliers([...suppliers, form]);
    }
    setForm(defaultSupplier);
  };

  const handleEdit = (idx: number) => {
    setForm(suppliers[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setSuppliers(suppliers.filter((_, i) => i !== idx));
    setForm(defaultSupplier);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>Supplier Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="supplierName">Supplier Name</label>
            <input id="supplierName" name="supplierName" value={form.supplierName} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <select id="company" name="company" value={form.company} onChange={handleChange} required>
              <option value="">Select Company</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="supplierPhone">Phone</label>
            <input id="supplierPhone" name="supplierPhone" value={form.supplierPhone} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="supplierAddress">Address</label>
            <input id="supplierAddress" name="supplierAddress" value={form.supplierAddress} onChange={handleChange} type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="supplierGST">GST Number</label>
            <input id="supplierGST" name="supplierGST" value={form.supplierGST} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="lockSupplier" style={{marginRight: 8}}>
              <input id="lockSupplier" name="lockSupplier" type="checkbox" checked={form.lockSupplier} onChange={handleChange} /> Lock Supplier
            </label>
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Supplier</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>Name</th><th>Company</th><th>Phone</th><th>GST</th><th>Lock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, idx) => (
            <tr key={s.supplierName}>
              <td>{s.supplierName}</td>
              <td>{s.company}</td>
              <td>{s.supplierPhone}</td>
              <td>{s.supplierGST}</td>
              <td>{s.lockSupplier ? 'Yes' : 'No'}</td>
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

export default SupplierMasterForm;
