
import { ReactNode } from 'react';

type PlaneBadgeProps = {
  children: ReactNode;
  plane?: 'material' | 'emerald' | 'bubblegum' | 'inferno' | 'sky' | 'ethereal';
  className?: string;
};

export function PlaneBadge({ children, plane = 'ethereal', className = '' }: PlaneBadgeProps) {
  const planeColors = {
    material: 'bg-gradient-to-r from-amber-700/30 to-yellow-800/30 text-amber-200 border-amber-600/40',
    emerald: 'bg-gradient-to-r from-emerald-700/30 to-green-800/30 text-emerald-200 border-emerald-600/40',
    bubblegum: 'bg-gradient-to-r from-pink-700/30 to-fuchsia-800/30 text-pink-200 border-pink-600/40',
    inferno: 'bg-gradient-to-r from-red-700/30 to-orange-800/30 text-red-200 border-red-600/40',
    sky: 'bg-gradient-to-r from-blue-700/30 to-sky-800/30 text-blue-200 border-blue-600/40',
    ethereal: 'bg-gradient-to-r from-purple-700/30 to-violet-800/30 text-purple-200 border-purple-600/40',
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-serif font-medium border shadow-mystical ${planeColors[plane]} ${className}`}
    >
      {children}
    </span>
  );
}
