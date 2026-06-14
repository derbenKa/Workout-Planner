import React, { useState, useEffect } from 'react';
import { getPlan, getExercises, addToPlan, removeFromPlan, updatePlanItem } from '../api';
import AddToPlanModal from '../components/AddToPlanModal';

const DAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const DAY_SHORT = { Montag:'Mo', Dienstag:'Di', Mittwoch:'Mi', Donnerstag:'Do', Freitag:'Fr', Samstag:'Sa', Sonntag:'So' };

export default function Plan() {
  const [plan, setPlan] = useState({});
  const [exercises, setExercises] = useState([]);
  const [addModal, setAddModal] = useState(null); // null | day string

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

  return (
    <div className="page">
      <div className="top-bar">
        <h1>Wochenplan</h1>
        <button className="btn btn-primary" onClick={() => setAddModal('Montag')}>+ Übung hinzufügen</button>
      </div>

      <div className="plan-grid">
        {DAYS.map(day => (
          <div key={day} className="day-column">
            <div className="day-header">{DAY_SHORT[day]}</div>
            <div className="day-body">
              {(plan[day] || []).map(item => (
                <div key={item.id} className="plan-item">
                  {item.image_path && (
                    <img src={item.image_path} className="plan-thumb" alt="" />
                  )}
                  <div className="plan-name">{item.name}</div>
                  <div className="plan-detail">{item.sets}×{item.reps}</div>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%', fontSize: 11 }}
                    onClick={() => handleRemove(item.id)}
                  >
                    Entfernen
                  </button>
                </div>
              ))}
              <button className="add-to-day-btn" onClick={() => setAddModal(day)}>+ hinzufügen</button>
            </div>
          </div>
        ))}
      </div>

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
