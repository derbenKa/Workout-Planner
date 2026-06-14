import React, { useState, useEffect } from 'react';
import { getPlan, getExercises, addToPlan, removeFromPlan, updatePlanItem } from '../api';
import AddToPlanModal from '../components/AddToPlanModal';

const DAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const DAY_SHORT = { Montag:'Mo', Dienstag:'Di', Mittwoch:'Mi', Donnerstag:'Do', Freitag:'Fr', Samstag:'Sa', Sonntag:'So' };

function PlanItem({ item, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [sets, setSets] = useState(String(item.sets));
  const [reps, setReps] = useState(String(item.reps));

  async function handleSave() {
    await onUpdate(item.id, sets, reps);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setSets(String(item.sets)); setReps(String(item.reps)); setEditing(false); }
  }

  return (
    <div className="plan-item">
      {item.image_path && <img src={item.image_path} className="plan-thumb" alt="" />}
      <div className="plan-name">{item.name}</div>

      {editing ? (
        <div className="plan-edit">
          <div className="plan-edit-row">
            <label>Sätze</label>
            <input
              type="number"
              min="1"
              value={sets}
              onChange={e => setSets(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="plan-edit-row">
            <label>Wdh.</label>
            <input
              value={reps}
              onChange={e => setReps(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="z.B. 8–12"
            />
          </div>
          <div className="plan-edit-actions">
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Speichern</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSets(String(item.sets)); setReps(String(item.reps)); setEditing(false); }}>✕</button>
          </div>
        </div>
      ) : (
        <div className="plan-detail clickable" onClick={() => setEditing(true)} title="Klicken zum Bearbeiten">
          {item.sets}×{item.reps} ✏️
        </div>
      )}

      <button
        className="btn btn-danger btn-sm"
        style={{ width: '100%', fontSize: 11, marginTop: 6 }}
        onClick={() => onRemove(item.id)}
      >
        Entfernen
      </button>
    </div>
  );
}

export default function Plan() {
  const [plan, setPlan] = useState({});
  const [exercises, setExercises] = useState([]);
  const [addModal, setAddModal] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const [p, ex] = await Promise.all([getPlan(), getExercises()]);
    setPlan(p);
    setExercises(ex);
  }

  async function handleAdd(day, exercise_id, sets, reps) {
    await addToPlan(day, exercise_id, sets, reps);
    setAddModal(null);
    load();
  }

  async function handleRemove(id) {
    await removeFromPlan(id);
    load();
  }

  async function handleUpdate(id, sets, reps) {
    await updatePlanItem(id, sets, reps);
    load();
  }

  return (
    <div className="plan-page">
      <div className="page" style={{ paddingBottom: 0 }}>
        <div className="top-bar">
          <h1>Wochenplan</h1>
          <button className="btn btn-primary" onClick={() => setAddModal('Montag')}>+ Übung hinzufügen</button>
        </div>
      </div>

      <div className="plan-scroll"><div className="plan-grid">
        {DAYS.map(day => (
          <div key={day} className="day-column">
            <div className="day-header">{DAY_SHORT[day]}</div>
            <div className="day-body">
              {(plan[day] || []).map(item => (
                <PlanItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onUpdate={handleUpdate}
                />
              ))}
              <button className="add-to-day-btn" onClick={() => setAddModal(day)}>+ hinzufügen</button>
            </div>
          </div>
        ))}
      </div></div>

      {addModal && (
        <AddToPlanModal
          exercises={exercises}
          preselectedDay={addModal}
          onSave={handleAdd}
          onClose={() => setAddModal(null)}
        />
      )}
    </div>
  );
}
