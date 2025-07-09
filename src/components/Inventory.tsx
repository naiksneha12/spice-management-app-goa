import React, { useEffect, useState } from 'react';
import './Inventory.css';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
}

const Inventory: React.FC<{ onSelect: (id: number) => void }> = ({ onSelect }) => {
  const [spiceMixes, setSpiceMixes] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetch('/data/inventory.json')
      .then((res) => res.json())
      .then((data) => setSpiceMixes(data));
  }, []);

  return (
    <div className="inventory-bg">
      <div className="inventory-card">
        <div className="inventory-title">Inventory</div>
        <ul className="inventory-list">
          {spiceMixes.length === 0 ? (
            <li className="inventory-list-item">No inventory data found.</li>
          ) : (
            spiceMixes.map((mix) => (
              <li key={mix.id} className="inventory-list-item">
                <span>{mix.name}</span>
                <span>Qty: {mix.quantity}</span>
                <button className="inventory-details-btn" onClick={() => onSelect(mix.id)}>
                  Details
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Inventory;
