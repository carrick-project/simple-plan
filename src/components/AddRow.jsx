import React from 'react';
import { Plus } from 'lucide-react';

export default function AddRow({ label, onClick }) {
  return (
    <button type="button" className="add-row" onClick={onClick}>
      <Plus size={14} strokeWidth={2.5} />
      {label}
    </button>
  );
}
