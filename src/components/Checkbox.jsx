import React from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({ checked, onClick, round = false, label }) {
  return (
    <button
      type="button"
      className={`checkbox${checked ? ' on' : ''}${round ? ' round' : ''}`}
      aria-pressed={checked}
      aria-label={label}
      onClick={onClick}
    >
      {checked && <Check size={14} strokeWidth={3} />}
    </button>
  );
}
