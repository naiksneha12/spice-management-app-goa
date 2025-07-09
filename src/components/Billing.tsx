import React, { useState, useEffect } from 'react';
import './Billing.css';

interface SpiceMix {
  id: number;
  name: string;
  price: number; // price per unit in INR
}

export interface Bill {
  name: string;
  quantity: number;
  total: number;
  date: string;
}

const Billing: React.FC<{ onNewBill?: (bill: Bill) => void }> = ({ onNewBill }) => {
  const [spiceMixes, setSpiceMixes] = useState<SpiceMix[]>([]);
  const [selectedMix, setSelectedMix] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    fetch('/src/data/spiceMixes.json')
      .then(res => res.json())
      .then((data: Omit<SpiceMix, 'price'>[]) => {
        setSpiceMixes(data.map((mix) => ({ ...mix, price: 120 + mix.id * 30 })));
      });
  }, []);

  const handleBill = () => {
    const mix = spiceMixes.find(m => String(m.id) === selectedMix);
    if (mix && quantity > 0) {
      const newBill: Bill = {
        name: mix.name,
        quantity,
        total: mix.price * quantity,
        date: new Date().toLocaleDateString()
      };
      setBills(prev => [...prev, newBill]);
      if (onNewBill) onNewBill(newBill);
      setQuantity(1);
      setSelectedMix('');
    }
  };

  return (
    <div className="billing-bg">
      <div className="billing-card">
        <div className="billing-title">Billing</div>
        <select
          className="billing-input"
          value={selectedMix}
          onChange={e => setSelectedMix(e.target.value)}
        >
          <option value="" disabled>Select Spice Mix</option>
          {spiceMixes.map(mix => (
            <option key={mix.id} value={mix.id}>{mix.name} (₹{mix.price}/unit)</option>
          ))}
        </select>
        <input
          className="billing-input"
          type="number"
          min={1}
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <button className="billing-btn" onClick={handleBill} disabled={!selectedMix}>
          Generate Bill
        </button>
        <ul className="billing-list">
          {bills.map((bill, idx) => (
            <li key={idx} className="billing-list-item">
              {bill.name} × {bill.quantity} = <b>₹{bill.total}</b> - {bill.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Billing;
