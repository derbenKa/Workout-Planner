import React, { useState, useEffect } from 'react';
import { getExercises, createExercise, updateExercise, deleteExercise } from '../api';
import ExerciseModal from '../components/ExerciseModal';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState('Alle');
  const [modal, setModal] = useState(null); // null | 'new' | exercise obj

  useEffect(() => { load(); }, []);

  async function load() {
    setExercises(await getExercises());
  }

  async function handleSave(fd) {
    if (modal === 'new') {
      await createExercise(fd);
    } else {
      await updateExercise(modal.id, fd);
    }
    setModal(null);
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Übung löschen? Sie wird auch aus dem Plan entfernt.')) return;
    await deleteExercise(id);
    load();
  }

  const groups = ['Alle', ...new Set(exercises.map(e => e.muscle_group).filter(Boolean))].sort();
  const filtered = filter === 'Alle' ? exercises : exercises.filter(e => e.muscle_group === filter);

  return (
    <div className="page">
      <div className="top-bar">
        <h1>Übungen</h1>
        <button className="btn btn-primary" onClick={() => setModal('new')}>+ Neue Übung</button>
      </div>

      <div className="filter-bar">
        {groups.map(g => (
          <span key={g} className={`chip${filter === g ? ' active' : ''}`} onClick={() => setFilter(g)}>{g}</span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="icon">💪</div>
          <p>Noch keine Übungen vorhanden</p>
          <button className="btn btn-primary" onClick={() => setModal('new')}>Erste Übung erstellen</button>
        </div>
      ) : (
        <div className="exercise-grid">
          {filtered.map(ex => (
            <div key={ex.id} className="exercise-card">
              {ex.image_path
                ? <img src={ex.image_path} alt={ex.name} />
                : <div className="no-img">💪</div>
              }
              <div className="card-body">
                <h3>{ex.name}</h3>
                <span>{ex.muscle_group || 'Keine Gruppe'}</span>
                {ex.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{ex.notes}</p>}
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(ex)}>Bearbeiten</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ex.id)}>Löschen</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ExerciseModal
          exercise={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
