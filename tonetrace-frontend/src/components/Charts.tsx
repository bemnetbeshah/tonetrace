import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
const COLORS = ['#6C5CE7','#A78BFA','#C4B5FD','#60A5FA'];
export function TrendLine({data}:{data:{date:string; value:number}[]}){
  return (
    <div className='h-48'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <XAxis dataKey='date' hide/>
          <YAxis hide/>
          <Tooltip/>
          <Line type='monotone' dataKey='value' stroke='#6C5CE7' strokeWidth={3} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export function TonePie({data}:{data:{name:string; value:number}[]}){
  return (
    <div className='h-48'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie data={data} dataKey='value' nameKey='name' outerRadius={80}>
            {data.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
export function IssuesBar({data}:{data:{name:string; value:number}[]}){
  if (!data || data.length === 0) {
    return (
      <div className='h-48 flex items-center justify-center text-gray-500' data-testid="issues-bar-chart">
        No issues found
      </div>
    );
  }

  return (
    <div className='h-48' data-testid="issues-bar-chart" role="img" aria-label="Grammar issues">
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <XAxis dataKey='name' label={{ value: 'Issue name', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey='value' fill='#A78BFA' radius={[6,6,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 