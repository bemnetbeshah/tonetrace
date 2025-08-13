import { useEffect, useState } from 'react';
import { api } from '../services/api';
export default function AssignmentsPage(){
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{(async()=>{ setLoading(true); setRows(await api.listAssignments()); setLoading(false); })();},[]);
  async function handleAnalyze(){
    // PLACEHOLDER_API: this would call POST /analyze for each submission in an assignment
    alert('Analyze is mocked. Replace with real POST /analyze calls later.');
  }
  if(loading) return <div>Loading...</div>;
  return (
    <div className='bg-white rounded-xl shadow divide-y'>
      {rows.map(a=> (
        <div key={a.id} className='p-4 flex items-center justify-between'>
          <div>
            <div className='font-semibold'>{a.title}</div>
            <div className='text-sm text-gray-500'>Due {new Date(a.dueDate).toLocaleDateString()}</div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-sm text-gray-700'>{a.submittedCount}/{a.totalCount} submitted</div>
            <button onClick={handleAnalyze} className='px-3 py-1.5 bg-indigo-600 text-white rounded'>Run Analysis</button>
          </div>
        </div>
      ))}
    </div>
  );
} 