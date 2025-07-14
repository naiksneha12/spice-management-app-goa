import React, { useState } from 'react';
import './MasterForm.css';

interface Vat {
  vatid: string;
  vatPercentName: string;
  vatPercent: number;
  lockVat: boolean;
}

const defaultVat: Vat = {
  vatid: '',
  vatPercentName: '',
  vatPercent: 0,
  lockVat: false
};

const VatMasterForm = () => {
  const [vats, setVats] = useState<Vat[]>([]);
  const [form, setForm] = useState<Vat>(defaultVat);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...vats];
      updated[editIndex] = form;
      setVats(updated);
      setEditIndex(null);
    } else {
      setVats([...vats, form]);
    }
    setForm(defaultVat);
  };

  const handleEdit = (idx: number) => {
    setForm(vats[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setVats(vats.filter((_, i) => i !== idx));
    setForm(defaultVat);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>VAT Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="vatid">VAT ID</label>
            <input id="vatid" name="vatid" value={form.vatid} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="vatPercentName">VAT % Name</label>
            <input id="vatPercentName" name="vatPercentName" value={form.vatPercentName} onChange={handleChange} required type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="vatPercent">VAT %</label>
            <input id="vatPercent" name="vatPercent" value={form.vatPercent} onChange={handleChange} type="number" />
          </div>
          <div className="form-group">
            <label htmlFor="lockVat" style={{marginRight: 8}}>
              <input id="lockVat" name="lockVat" type="checkbox" checked={form.lockVat} onChange={handleChange} /> Lock VAT %
            </label>
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} VAT</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>VAT ID</th><th>VAT % Name</th><th>VAT %</th><th>Lock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vats.map((v, idx) => (
            <tr key={v.vatid}>
              <td>{v.vatid}</td>
              <td>{v.vatPercentName}</td>
              <td>{v.vatPercent}</td>
              <td>{v.lockVat ? 'Yes' : 'No'}</td>
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

export default VatMasterForm;
