import React, { useState, useEffect } from 'react';
import './Billing.css';


interface SpiceMix {
  id: number;
  name: string;
  price: number; // price per unit in INR
}

interface GstMaster {
  gstid: string;
  gstPercentName: string;
  gstPercent: number;
  lockGst: boolean;
}

interface VatMaster {
  vatid: string;
  vatPercentName: string;
  vatPercent: number;
  lockVat: boolean;
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
  const [gstList, setGstList] = useState<GstMaster[]>([]);
  const [vatList, setVatList] = useState<VatMaster[]>([]);
  const [selectedGst, setSelectedGst] = useState<string>('');
  const [selectedVat, setSelectedVat] = useState<string>('');

  useEffect(() => {
    fetch('/data/spiceMixes.json')
      .then(res => res.json())
      .then((data: Omit<SpiceMix, 'price'>[]) => {
        setSpiceMixes(data.map((mix) => ({ ...mix, price: 120 + mix.id * 30 })));
      });
    fetch('/data/gstMaster.json')
      .then(res => res.json())
      .then((data: GstMaster[]) => setGstList(data));
    fetch('/data/vatMaster.json')
      .then(res => res.json())
      .then((data: VatMaster[]) => setVatList(data));
  }, []);

  const handleBill = () => {
    const mix = spiceMixes.find(m => String(m.id) === selectedMix);
    const gst = gstList.find(g => g.gstid === selectedGst);
    const vat = vatList.find(v => v.vatid === selectedVat);
    if (mix && quantity > 0) {
      const gstAmount = gst ? (mix.price * quantity * gst.gstPercent) / 100 : 0;
      const vatAmount = vat ? (mix.price * quantity * vat.vatPercent) / 100 : 0;
      const total = mix.price * quantity + gstAmount + vatAmount;
      const newBill: Bill = {
        name: mix.name + (gst ? ` (GST: ${gst.gstPercentName})` : '') + (vat ? ` (VAT: ${vat.vatPercentName})` : ''),
        quantity,
        total,
        date: new Date().toLocaleDateString()
      };
      setBills(prev => [...prev, newBill]);
      if (onNewBill) onNewBill(newBill);
      setQuantity(1);
      setSelectedMix('');
      setSelectedGst('');
      setSelectedVat('');
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
        <select
          className="billing-input"
          value={selectedGst}
          onChange={e => setSelectedGst(e.target.value)}
        >
          <option value="" disabled>Select GST</option>
          {gstList.map(gst => (
            <option key={gst.gstid} value={gst.gstid}>{gst.gstPercentName} ({gst.gstPercent}%)</option>
          ))}
        </select>
        <select
          className="billing-input"
          value={selectedVat}
          onChange={e => setSelectedVat(e.target.value)}
        >
          <option value="" disabled>Select VAT</option>
          {vatList.map(vat => (
            <option key={vat.vatid} value={vat.vatid}>{vat.vatPercentName} ({vat.vatPercent}%)</option>
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
              {bill.name} × {bill.quantity} = <b>₹{bill.total.toFixed(2)}</b> - {bill.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Billing;
