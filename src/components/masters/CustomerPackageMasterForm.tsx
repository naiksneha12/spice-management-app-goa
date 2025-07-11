import React, { useState, useEffect } from 'react';
import './MasterForm.css';

interface CustomerPackage {
  packageId: string;
  packageName: string;
  packageDescription: string;
}

const defaultPackage: CustomerPackage = {
  packageId: '',
  packageName: '',
  packageDescription: ''
};

const CustomerPackageMasterForm = () => {
  const [packages, setPackages] = useState<CustomerPackage[]>([]);
  const [form, setForm] = useState<CustomerPackage>(defaultPackage);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/data/masters/customerPackageMaster.json')
      .then(res => res.json())
      .then(setPackages);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...packages];
      updated[editIndex] = form;
      setPackages(updated);
      setEditIndex(null);
    } else {
      setPackages([...packages, form]);
    }
    setForm(defaultPackage);
  };

  const handleEdit = (idx: number) => {
    setForm(packages[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setPackages(packages.filter((_, i) => i !== idx));
    setForm(defaultPackage);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>Customer Package Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="packageId">Package ID</label>
            <input id="packageId" name="packageId" value={form.packageId} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="packageName">Package Name</label>
            <input id="packageName" name="packageName" value={form.packageName} onChange={handleChange} required type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="packageDescription">Package Description</label>
            <input id="packageDescription" name="packageDescription" value={form.packageDescription} onChange={handleChange} type="text" />
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Package</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((p, idx) => (
            <tr key={p.packageId}>
              <td>{p.packageId}</td>
              <td>{p.packageName}</td>
              <td>{p.packageDescription}</td>
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

export default CustomerPackageMasterForm;
