import React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      )}
      {children}
    </section>
  );
};
