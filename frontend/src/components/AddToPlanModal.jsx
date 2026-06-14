import React, { useState } from 'react';

const DAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];

export default function AddToPlanModal({ exercises, preselectedDay, onSave, onClose }) {
  const [day, setDay] = useState(preselectedDay || 'Montag');
  const [exerciseId, setExerciseId] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('10');
  const [search, setSearch] = useState('');

  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!exerciseId) return;
    onSave(day, Number(exerciseId), Number(sets), reps);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Übung zum Plan hinzufügen</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tag</label>
            <select value={day} onChange={e => setDay(e.target.value)}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Übung suchen</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name eingeben..." />
          </div>
          <div className="exercise-picker-list">
            {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Keine Übungen gefunden</p>}
            {filtered.map(ex => (
              <div
                key={ex.id}
                className={`picker-item${exerciseId == ex.id ? ' selected' : ''}`}
                style={exerciseId == ex.id ? { borderColor: 'var(--accent)' } : {}}
                onClick={() => setExerciseId(ex.id)}
              >
                {ex.image_path
                  ? <img src={ex.image_path} alt="" />
                  : <div className="no-img-sm">💪</div>
                }
                <div className="info">
                  <strong>{ex.name}</strong>
                  <span>{ex.muscle_group || 'Keine Gruppe'}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sätze</label>
              <input type="number" min="1" max="20" value={sets} onChange={e => setSets(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Wiederholungen</label>
              <input value={reps} onChange={e => setReps(e.target.value)} placeholder="10 oder 8-12" />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Abbrechen</button>
            <button type="submit" className="btn btn-primary" disabled={!exerciseId}>Hinzufügen</button>
          </div>
        </form>
      </div>
    </div>
  );
}
