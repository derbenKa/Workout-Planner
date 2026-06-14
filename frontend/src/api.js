const BASE = '/api';

export async function getExercises() {
  const r = await fetch(`${BASE}/exercises`);
  return r.json();
}

export async function createExercise(formData) {
  const r = await fetch(`${BASE}/exercises`, { method: 'POST', body: formData });
  return r.json();
}

export async function updateExercise(id, formData) {
  const r = await fetch(`${BASE}/exercises/${id}`, { method: 'PUT', body: formData });
  return r.json();
}

export async function deleteExercise(id) {
  const r = await fetch(`${BASE}/exercises/${id}`, { method: 'DELETE' });
  return r.json();
}

export async function getPlan() {
  const r = await fetch(`${BASE}/plan`);
  return r.json();
}

export async function addToPlan(day, exercise_id, sets, reps) {
  const r = await fetch(`${BASE}/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day, exercise_id, sets, reps }),
  });
  return r.json();
}

export async function updatePlanItem(id, sets, reps) {
  const r = await fetch(`${BASE}/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sets, reps }),
  });
  return r.json();
}

export async function removeFromPlan(id) {
  const r = await fetch(`${BASE}/plan/${id}`, { method: 'DELETE' });
  return r.json();
}
