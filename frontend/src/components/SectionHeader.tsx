import React from 'react';

interface SectionHeaderProps {
  title: string;
  actionSlot?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionSlot }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {actionSlot && (
        <div className="flex items-center gap-2">
          {actionSlot}
        </div>
      )}
    </div>
  );
};
