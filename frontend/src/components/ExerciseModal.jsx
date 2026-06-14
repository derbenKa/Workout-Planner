import React, { useState, useRef } from 'react';

const MUSCLE_GROUPS = [
  'Brust', 'Rücken', 'Schultern', 'Bizeps', 'Trizeps',
  'Beine', 'Gesäß', 'Bauch', 'Nacken', 'Unterarme', 'Waden',
];

export default function ExerciseModal({ exercise, onSave, onClose }) {
  const [name, setName] = useState(exercise?.name || '');
  const [muscleGroup, setMuscleGroup] = useState(exercise?.muscle_group || '');
  const [notes, setNotes] = useState(exercise?.notes || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(exercise?.image_path || null);
  const fileRef = useRef();

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('muscle_group', muscleGroup);
    fd.append('notes', notes);
    if (imageFile) fd.append('image', imageFile);
    onSave(fd);
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{exercise ? 'Übung bearbeiten' : 'Neue Übung'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Bankdrücken" autoFocus />
          </div>
          <div className="form-group">
            <label>Muskelgruppe</label>
            <select value={muscleGroup} onChange={e => setMuscleGroup(e.target.value)}>
              <option value="">— auswählen —</option>
              {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Notizen</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Technik-Tipps, Hinweise..." />
          </div>
          <div className="form-group">
            <label>Bild</label>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleFile} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current.click()}>
              📷 Bild auswählen
            </button>
            {preview && <img src={preview} className="img-preview" alt="" />}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Abbrechen</button>
            <button type="submit" className="btn btn-primary">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  );
}
