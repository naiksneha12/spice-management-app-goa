import React, { useState } from 'react';
import MastersMenu from './MastersMenu';
import ProductMasterForm from './ProductMasterForm';
import SupplierMasterForm from './SupplierMasterForm';
import CompanyMasterForm from './CompanyMasterForm';
import CustomerMasterForm from './CustomerMasterForm';
import ProductCategoryMasterForm from './ProductCategoryMasterForm';
import CustomerPackageMasterForm from './CustomerPackageMasterForm';
import './MastersPage.css';

const masterList = [
  { key: 'product', label: 'Product Master', component: <ProductMasterForm /> },
  { key: 'supplier', label: 'Supplier Master', component: <SupplierMasterForm /> },
  { key: 'company', label: 'Company Master', component: <CompanyMasterForm /> },
  { key: 'customer', label: 'Customer Master', component: <CustomerMasterForm /> },
  { key: 'product-category', label: 'Product Category Master', component: <ProductCategoryMasterForm /> },
  { key: 'customer-package', label: 'Customer Package Master', component: <CustomerPackageMasterForm /> },
];

function MastersPage() {
  const [selected, setSelected] = useState('product');

  return (
    <div className="masters-page-layout">
      <MastersMenu selected={selected} onSelect={setSelected} />
      <div className="masters-form-block">
        {masterList.find(m => m.key === selected)?.component}
      </div>
    </div>
  );
}

export default MastersPage;