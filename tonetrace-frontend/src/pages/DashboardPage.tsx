import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import { TrendLine, TonePie, IssuesBar } from '../components/Charts';
import { api } from '../services/api';

export default function DashboardPage(){
  const [loading, setLoading] = useState(true);
  const [assn, setAssn] = useState<any[]>([]);
  const [hist, setHist] = useState<any[]>([]);

  useEffect(()=>{(async()=>{
    setLoading(true);
    const s = await api.listStudents();
    const a = await api.listAssignments();
    // choose first student for the trend examples
    const h = await api.history(s[0].id, 10);
    setAssn(a); setHist(h); setLoading(false);
  })();},[]);

  const avgFormality = useMemo(()=> Math.round(hist.reduce((s,x)=>s+x.formality,0)/Math.max(hist.length,1)),[hist]);
  const avgComplexity = useMemo(()=> Math.round(hist.reduce((s,x)=>s+x.complexity,0)/Math.max(hist.length,1)),[hist]);
  const avgReadability = useMemo(()=> Math.round(hist.reduce((s,x)=>s+x.readability.fk,0)/Math.max(hist.length,1)),[hist]);
  const submissions = useMemo(()=> assn.reduce((s,a)=>s+a.submittedCount,0),[assn]);

  const trendData = hist.map(h=>({ date: new Date(h.createdAt).toLocaleDateString('en-US',{month:'short', day:'2-digit'}), value: h.formality }));
  const tonePie = hist[0]?.toneDistribution?.map((t:any)=>({ name:t.label, value: t.pct })) || [];
  const issuesBar = (hist[0]?.grammarIssues || []).map((g:any)=>({ name:g.type.replace('_',' '), value:g.count }));

  if(loading) return <div className='animate-pulse grid grid-cols-4 gap-4'>
    {Array.from({length:6}).map((_,i)=>(<div key={i} className='h-28 bg-white rounded-xl shadow'/ >))}
  </div>;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <Card title='Average Formality' value={avgFormality} />
        <Card title='Average Complexity' value={avgComplexity} />
        <Card title='Average Readability (FK)' value={avgReadability} />
        <Card title='Assignments Submitted' value={submissions} />
        <Card title='AI Use Alerts' value={'2 anomalies'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card title='Class Progress Trends'><TrendLine data={trendData}/></Card>
        <Card title='Tone Distribution'><TonePie data={tonePie}/></Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card title='Common Grammar Issues'><IssuesBar data={issuesBar}/></Card>
        <Card title='Assignments Status'>
          <ul className='text-sm divide-y'>
            {assn.map(a=> (
              <li key={a.id} className='py-2 flex items-center justify-between'>
                <div>
                  <div className='font-medium'>{a.title}</div>
                  <div className='text-gray-500'>Due {new Date(a.dueDate).toLocaleDateString()}</div>
                </div>
                <div className='text-gray-700'>{a.submittedCount}/{a.totalCount} submitted</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
} 