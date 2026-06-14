import React, { useState } from 'react';
import Exercises from './pages/Exercises';
import Plan from './pages/Plan';

export default function App() {
  const [page, setPage] = useState('exercises');

  return (
    <>
      <nav>
        <span className="logo">🏋️ Workout</span>
        <button className={page === 'exercises' ? 'active' : ''} onClick={() => setPage('exercises')}>
          Übungen
        </button>
        <button className={page === 'plan' ? 'active' : ''} onClick={() => setPage('plan')}>
          Wochenplan
        </button>
      </nav>
      {page === 'exercises' ? <Exercises /> : <Plan />}
    </>
  );
}
