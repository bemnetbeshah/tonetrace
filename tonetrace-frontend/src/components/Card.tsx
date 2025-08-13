import type { ReactNode } from 'react';
export default function Card({title, value, icon, children}:{title?:string; value?:ReactNode; icon?:ReactNode; children?:ReactNode;}){
  return (
    <div className='bg-white rounded-xl shadow p-4'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-gray-500'>{title}</div>
        {icon}
      </div>
      {value && <div className='mt-2 text-3xl font-semibold'>{value}</div>}
      {children}
    </div>
  );
} 