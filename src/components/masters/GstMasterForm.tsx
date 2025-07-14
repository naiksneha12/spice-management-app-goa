import React, { useState } from 'react';
import './MasterForm.css';

interface Gst {
  gstid: string;
  gstPercentName: string;
  gstPercent: number;
  lockGst: boolean;
}

const defaultGst: Gst = {
  gstid: '',
  gstPercentName: '',
  gstPercent: 0,
  lockGst: false
};

const GstMasterForm = () => {
  const [gsts, setGsts] = useState<Gst[]>([]);
  const [form, setForm] = useState<Gst>(defaultGst);
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
      const updated = [...gsts];
      updated[editIndex] = form;
      setGsts(updated);
      setEditIndex(null);
    } else {
      setGsts([...gsts, form]);
    }
    setForm(defaultGst);
  };

  const handleEdit = (idx: number) => {
    setForm(gsts[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setGsts(gsts.filter((_, i) => i !== idx));
    setForm(defaultGst);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>GST Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gstid">GST ID</label>
            <input id="gstid" name="gstid" value={form.gstid} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="gstPercentName">GST % Name</label>
            <input id="gstPercentName" name="gstPercentName" value={form.gstPercentName} onChange={handleChange} required type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gstPercent">GST %</label>
            <input id="gstPercent" name="gstPercent" value={form.gstPercent} onChange={handleChange} type="number" />
          </div>
          <div className="form-group">
            <label htmlFor="lockGst" style={{marginRight: 8}}>
              <input id="lockGst" name="lockGst" type="checkbox" checked={form.lockGst} onChange={handleChange} /> Lock GST %
            </label>
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} GST</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>GST ID</th><th>GST % Name</th><th>GST %</th><th>Lock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gsts.map((g, idx) => (
            <tr key={g.gstid}>
              <td>{g.gstid}</td>
              <td>{g.gstPercentName}</td>
              <td>{g.gstPercent}</td>
              <td>{g.lockGst ? 'Yes' : 'No'}</td>
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

export default GstMasterForm;
