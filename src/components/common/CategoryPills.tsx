import React from 'react';
import { ServiceCategory } from '../../types';

interface CategoryPillsProps {
  selected: ServiceCategory | 'todos';
  onSelect: (cat: ServiceCategory | 'todos') => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ selected, onSelect }) => {
  const categories: { key: ServiceCategory | 'todos'; label: string; icon: string }[] = [
    { key: 'todos', label: 'Todos os serviços', icon: 'grid_view' },
    { key: 'barbearia', label: 'Barbearia', icon: 'content_cut' },
    { key: 'cabelo', label: 'Cabelo', icon: 'brush' },
    { key: 'unhas', label: 'Unhas', icon: 'auto_fix_high' },
    { key: 'estetica', label: 'Estética', icon: 'spa' },
    { key: 'massagem', label: 'Massagem', icon: 'self_improvement' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {categories.map((cat) => {
        const isActive = selected === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
              isActive
                ? 'bg-primary text-on-primary border border-primary shadow-primary/10'
                : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low border border-outline-variant'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-on-primary' : 'text-primary'}`}>
              {cat.icon}
            </span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
