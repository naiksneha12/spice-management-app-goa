import React from 'react';
import './MastersMenu.css';

const menuItems = [
  { key: 'product', label: 'Product Master' },
  { key: 'supplier', label: 'Supplier Master' },
  { key: 'company', label: 'Company Master' },
  { key: 'customer', label: 'Customer Master' },
  { key: 'product-category', label: 'Product Category Master' },
  { key: 'customer-package', label: 'Customer Package Master' },
];

const MastersMenu = ({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) => (
  <div className="masters-menu vertical">
    <h2>Masters</h2>
    <ul>
      {menuItems.map(item => (
        <li key={item.key}>
          <button
            className={selected === item.key ? 'active' : ''}
            onClick={() => onSelect(item.key)}
            type="button"
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default MastersMenu;
