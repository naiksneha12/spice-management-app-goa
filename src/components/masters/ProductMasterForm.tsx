import React, { useState, useEffect } from 'react';
import './MasterForm.css';

interface Product {
  productCode: string;
  productName: string;
  productDescription: string;
  purchaseRate: number;
  sellingRate: number;
  mrpRate: number;
  specialRate: number;
  productDiscountPercent: number;
  gstPercent: number;
  vatPercent: number;
  productCompany: string;
  favouriteSupplier: string;
  hsnCode: string;
  barCode: string;
  lockProduct: boolean;
  creditDays: number;
}

const defaultProduct: Product = {
  productCode: '',
  productName: '',
  productDescription: '',
  purchaseRate: 0,
  sellingRate: 0,
  mrpRate: 0,
  specialRate: 0,
  productDiscountPercent: 0,
  gstPercent: 0,
  vatPercent: 0,
  productCompany: '',
  favouriteSupplier: '',
  hsnCode: '',
  barCode: '',
  lockProduct: false,
  creditDays: 0
};

const ProductMasterForm = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>(defaultProduct);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/data/masters/productMaster.json')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = form;
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts([...products, form]);
    }
    setForm(defaultProduct);
  };

  const handleEdit = (idx: number) => {
    setForm(products[idx]);
    setEditIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
    setForm(defaultProduct);
    setEditIndex(null);
  };

  return (
    <div className="master-form-container">
      <h2>Product Master</h2>
      <form className="master-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="productCode">Product Code</label>
            <input id="productCode" name="productCode" value={form.productCode} onChange={handleChange} required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input id="productName" name="productName" value={form.productName} onChange={handleChange} required type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label htmlFor="productDescription">Description</label>
            <input id="productDescription" name="productDescription" value={form.productDescription} onChange={handleChange} type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="purchaseRate">Purchase Rate (₹)</label>
            <input id="purchaseRate" name="purchaseRate" value={form.purchaseRate} onChange={handleChange} type="number" inputMode="decimal" />
          </div>
          <div className="form-group">
            <label htmlFor="sellingRate">Selling Rate (₹)</label>
            <input id="sellingRate" name="sellingRate" value={form.sellingRate} onChange={handleChange} type="number" inputMode="decimal" />
          </div>
          <div className="form-group">
            <label htmlFor="mrpRate">MRP Rate (₹)</label>
            <input id="mrpRate" name="mrpRate" value={form.mrpRate} onChange={handleChange} type="number" inputMode="decimal" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="specialRate">Special Rate (₹)</label>
            <input id="specialRate" name="specialRate" value={form.specialRate} onChange={handleChange} type="number" inputMode="decimal" />
          </div>
          <div className="form-group">
            <label htmlFor="productDiscountPercent">Discount %</label>
            <input id="productDiscountPercent" name="productDiscountPercent" value={form.productDiscountPercent} onChange={handleChange} type="number" inputMode="decimal" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gstPercent">GST %</label>
            <input id="gstPercent" name="gstPercent" value={form.gstPercent} onChange={handleChange} type="number" inputMode="decimal" />
          </div>
          <div className="form-group">
            <label htmlFor="vatPercent">VAT %</label>
            <input id="vatPercent" name="vatPercent" value={form.vatPercent} onChange={handleChange} type="number" inputMode="decimal" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="productCompany">Product Company</label>
            <input id="productCompany" name="productCompany" value={form.productCompany} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="favouriteSupplier">Favourite Supplier</label>
            <input id="favouriteSupplier" name="favouriteSupplier" value={form.favouriteSupplier} onChange={handleChange} type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hsnCode">HSN Code</label>
            <input id="hsnCode" name="hsnCode" value={form.hsnCode} onChange={handleChange} type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="barCode">Bar Code</label>
            <input id="barCode" name="barCode" value={form.barCode} onChange={handleChange} type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lockProduct" style={{marginRight: 8}}>
              <input id="lockProduct" name="lockProduct" type="checkbox" checked={form.lockProduct} onChange={handleChange} /> Lock Product
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="creditDays">Credit Days</label>
            <input id="creditDays" name="creditDays" value={form.creditDays} onChange={handleChange} type="number" inputMode="numeric" />
          </div>
        </div>
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'} Product</button>
      </form>
      <table className="master-table">
        <thead>
          <tr>
            <th>Code</th><th>Name</th><th>Company</th><th>Supplier</th><th>MRP</th><th>Lock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p.productCode}>
              <td>{p.productCode}</td>
              <td>{p.productName}</td>
              <td>{p.productCompany}</td>
              <td>{p.favouriteSupplier}</td>
              <td>{p.mrpRate}</td>
              <td>{p.lockProduct ? 'Yes' : 'No'}</td>
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

export default ProductMasterForm;
