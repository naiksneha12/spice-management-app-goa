import React, { useState, useEffect } from 'react';
import './MasterForm.css';

interface Company {
  companyShortName: string;
  companyName: string;
  companyLic: string;
  companySuppliers: string[];
  companyCredit: number;
  lockCompany: boolean;
}

const defaultCompany: Company = {
  companyShortName: '',
  companyName: '',
  companyLic: '',
  companySuppliers: [],
  companyCredit: 0,
  lockCompany: false
};

const CompanyMasterForm = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<Company>(defaultCompany);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [allSuppliers, setAllSuppliers] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/masters/companyMaster.json')
      .then(res => res.json())
      .then(setCompanies);
    fetch('/data/masters/supplierMaster.json')
      .then(res => res.json())
      .then((data: { supplierName: string }[]) => setAllSuppliers(data.map(s => s.supplierName)));
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
      const updated = [...companies];
      updated[editIndex] = form;
      setCompanies(updated);
      setEditIndex(null);
    } else {
      setCompanies([...companies, form]);
    }
    setForm(defaultCompany);
  };

  const handleEdit = (idx: number) => {
    setForm(companies[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setCompanies(companies.filter((_, i) => i !== idx));
    setForm(defaultCompany);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>Company Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyShortName">Short Name</label>
            <input id="companyShortName" name="companyShortName" value={form.companyShortName} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} required type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="companyLic">License Number</label>
            <input id="companyLic" name="companyLic" value={form.companyLic} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="companyCredit">Credit Limit</label>
            <input id="companyCredit" name="companyCredit" value={form.companyCredit} onChange={handleChange} type="number" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="companySuppliers">Suppliers</label>
            <select id="companySuppliers" name="companySuppliers" value={form.companySuppliers} onChange={handleChange} multiple>
              {allSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="lockCompany" style={{marginRight: 8}}>
              <input id="lockCompany" name="lockCompany" type="checkbox" checked={form.lockCompany} onChange={handleChange} /> Lock Company
            </label>
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Company</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>Short Name</th><th>Name</th><th>Suppliers</th><th>Credit</th><th>Lock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, idx) => (
            <tr key={c.companyShortName}>
              <td>{c.companyShortName}</td>
              <td>{c.companyName}</td>
              <td>{c.companySuppliers.join(', ')}</td>
              <td>{c.companyCredit}</td>
              <td>{c.lockCompany ? 'Yes' : 'No'}</td>
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

export default CompanyMasterForm;
