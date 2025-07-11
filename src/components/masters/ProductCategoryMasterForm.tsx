import React, { useState, useEffect } from 'react';
import './MasterForm.css';

interface ProductCategory {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
}

const defaultCategory: ProductCategory = {
  categoryId: '',
  categoryName: '',
  categoryDescription: ''
};

const ProductCategoryMasterForm = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [form, setForm] = useState<ProductCategory>(defaultCategory);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/data/masters/productCategoryMaster.json')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...categories];
      updated[editIndex] = form;
      setCategories(updated);
      setEditIndex(null);
    } else {
      setCategories([...categories, form]);
    }
    setForm(defaultCategory);
  };

  const handleEdit = (idx: number) => {
    setForm(categories[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setCategories(categories.filter((_, i) => i !== idx));
    setForm(defaultCategory);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>Product Category Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoryId">Category ID</label>
            <input id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input id="categoryName" name="categoryName" value={form.categoryName} onChange={handleChange} required type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="categoryDescription">Category Description</label>
            <input id="categoryDescription" name="categoryDescription" value={form.categoryDescription} onChange={handleChange} type="text" />
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Category</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, idx) => (
            <tr key={c.categoryId}>
              <td>{c.categoryId}</td>
              <td>{c.categoryName}</td>
              <td>{c.categoryDescription}</td>
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

export default ProductCategoryMasterForm;
