import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
export default function StudentsPage(){
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{(async()=>{ setLoading(true); setRows(await api.listStudents()); setLoading(false); })();},[]);
  if(loading) return <div>Loading...</div>;
  return (
    <div className='bg-white rounded-xl shadow'>
      <table className='w-full text-left'>
        <thead className='border-b'>
          <tr><th className='p-3'>Name</th><th className='p-3'>Email</th><th className='p-3'>Last submission</th><th className='p-3'/></tr>
        </thead>
        <tbody>
          {rows.map(s=> (
            <tr key={s.id} className='border-b hover:bg-gray-50'>
              <td className='p-3'>{s.name}</td>
              <td className='p-3'>{s.email}</td>
              <td className='p-3'>{s.lastSubmissionAt ? new Date(s.lastSubmissionAt).toLocaleString() : '—'}</td>
              <td className='p-3 text-right'><Link className='text-indigo-600' to={`/students/${s.id}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 