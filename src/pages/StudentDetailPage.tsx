import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import { TrendLine, IssuesBar, TonePie } from '../components/Charts';
import { api } from '../services/api';
export default function StudentDetailPage(){
  const { id='' } = useParams();
  const [hist, setHist] = useState<any[]>([]);
  const [perf, setPerf] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{(async()=>{
    setLoading(true);
    const [h,p,pm] = await Promise.all([
      api.history(id, 12),
      api.profile(id),
      api.performance(id)
    ]);
    setHist(h); setProfile(p); setPerf(pm); setLoading(false);
  })();},[id]);

  const trendFormality = hist.map(h=>({ date: new Date(h.createdAt).toLocaleDateString('en-US',{month:'short'}), value: h.formality }));
  const issuesBar = (hist[0]?.grammarIssues || []).map((g:any)=>({ name:g.type.replace('_',' '), value: g.count }));
  const tonePie = hist[0]?.toneDistribution?.map((t:any)=>({ name:t.label, value: t.pct })) || [];

  if(loading) return <div>Loading...</div>;
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card title='Baseline Formality' value={profile.baselineFormality} />
        <Card title='Baseline Complexity' value={profile.baselineComplexity} />
        <Card title='Fingerprint Stability' value={(profile.fingerprintStability*100).toFixed(0) + '%'} />
        <Card title='Avg Grammar Issues' value={Math.round(perf.avgGrammarIssues)} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card title='Formality Trend'><TrendLine data={trendFormality}/></Card>
        <Card title='Tone Distribution'><TonePie data={tonePie}/></Card>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card title='Common Grammar Issues'><IssuesBar data={issuesBar}/></Card>
        <Card title='Strengths and Weaknesses'>
          <div className='text-sm'>
            <div className='font-medium'>Strengths</div>
            <ul className='list-disc pl-5 text-gray-700'>{profile.strengths.map((s:string)=>(<li key={s}>{s}</li>))}</ul>
            <div className='mt-3 font-medium'>Weaknesses</div>
            <ul className='list-disc pl-5 text-gray-700'>{profile.weaknesses.map((s:string)=>(<li key={s}>{s}</li>))}</ul>
          </div>
        </Card>
      </div>
    </div>
  );
} 