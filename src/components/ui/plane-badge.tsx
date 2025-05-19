// src/components/ui/plane-badge.tsx
import { ReactNode } from 'react';

type PlaneBadgeProps = {
  children: ReactNode;
  plane?: 'material' | 'emerald' | 'bubblegum' | 'inferno' | 'sky' | 'ethereal';
  className?: string;
};

export function PlaneBadge({ children, plane = 'ethereal', className = '' }: PlaneBadgeProps) {
  const planeColors = {
    material: 'bg-gradient-to-r from-indigo-400 to-violet-600',
    emerald: 'bg-gradient-to-r from-emerald-400 to-green-600',
    bubblegum: 'bg-gradient-to-r from-pink-400 to-fuchsia-600',
    inferno: 'bg-gradient-to-r from-orange-400 to-red-600',
    sky: 'bg-gradient-to-r from-sky-300 to-blue-600',
    ethereal: 'bg-gradient-to-r from-amber-300 to-yellow-600',
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${planeColors[plane]} ${className}`}
    >
      {children}
    </span>
  );
}