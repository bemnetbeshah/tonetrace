import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyProps {
  title: string;
  message: string;
  actionSlot?: React.ReactNode;
}

export const Empty: React.FC<EmptyProps> = ({ title, message, actionSlot }) => {
  return (
    <div className="text-center py-12">
      <Inbox className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      {actionSlot && (
        <div className="mt-6">
          {actionSlot}
        </div>
      )}
    </div>
  );
};
