import { NavLink, Outlet } from 'react-router-dom';

export default function RootLayout(){
  return (
    <div className='min-h-screen grid grid-cols-[240px_1fr]'>
      <aside className='bg-slate-900 text-white p-4 space-y-4'>
        <div className='text-2xl font-bold'>ToneTrace</div>
        <nav className='space-y-2'>
          <NavLink className='block px-3 py-2 rounded hover:bg-slate-800' to='/'>Dashboard</NavLink>
          <NavLink className='block px-3 py-2 rounded hover:bg-slate-800' to='/students'>Students</NavLink>
          <NavLink className='block px-3 py-2 rounded hover:bg-slate-800' to='/assignments'>Assignments</NavLink>
        </nav>
      </aside>
      <main className='bg-gray-50'>
        <header className='h-16 bg-white shadow flex items-center justify-between px-6'>
          <h1 className='text-xl font-semibold'>Class Dashboard</h1>
          <div className='flex items-center gap-3'>
            <input placeholder='Search' className='border rounded px-3 py-1.5 text-sm'/>
            <div className='w-8 h-8 bg-slate-200 rounded-full'/>
          </div>
        </header>
        <div className='p-6'><Outlet/></div>
      </main>
    </div>
  );
} 