import React from 'react';

interface BadgeProps {
  tone?: 'success' | 'warning' | 'danger' | 'muted';
  children: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  tone = 'muted',
  children,
  className = ''
}) => {
  const toneClasses = {
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    muted: 'bg-slate-100 text-slate-700'
  };
  
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const classes = `${baseClasses} ${toneClasses[tone]} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge; 