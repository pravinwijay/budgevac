import React, { useState, useEffect } from 'react';
import { Gift, Trash2, Edit2, Users } from 'lucide-react';

export default function SouvenirsTab() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [people, setPeople] = useState([]);
  
  // Souvenir form state
  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Person form state
  const [personName, setPersonName] = useState('');
  const [personLoading, setPersonLoading] = useState(false);

  useEffect(() => {
    fetchSouvenirs();
    fetchPeople();
  }, []);

  const fetchSouvenirs = async () => {
    try {
      const res = await fetch('/api/souvenirs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSouvenirs(data);
      }
    } catch (err) {
      console.error('Error fetching souvenirs:', err);
    }
  };

  const fetchPeople = async () => {
    try {
      const res = await fetch('/api/people');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPeople(data);
        if (data.length > 0) {
          setRecipient(data[0].name);
        } else {
          setRecipient('');
        }
      }
    } catch (err) {
      console.error('Error fetching people:', err);
    }
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!personName.trim()) return;

    setPersonLoading(true);
    try {
      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: personName.trim() })
      });
      if (res.ok) {
        setPersonName('');
        await fetchPeople();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      console.error('Error adding person:', err);
    } finally {
      setPersonLoading(false);
    }
  };

  const handleDeletePerson = async (id) => {
    try {
      const res = await fetch(`/api/people/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchPeople();
      }
    } catch (err) {
      console.error('Error deleting person:', err);
    }
  };

  const handleAddSouvenir = async (e) => {
    e.preventDefault();
    if (!name || !recipient) return;

    setLoading(true);
    try {
      const url = editingId ? `/api/souvenirs/${editingId}` : '/api/souvenirs';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, recipient })
      });
      if (res.ok) {
        setName('');
        if (people.length > 0 && !editingId) {
          setRecipient(people[0].name);
        }
        setEditingId(null);
        fetchSouvenirs();
      }
    } catch (err) {
      console.error('Error saving souvenir:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (souvenir) => {
    setEditingId(souvenir.id);
    setName(souvenir.name);
    setRecipient(souvenir.recipient);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    if (people.length > 0) {
      setRecipient(people[0].name);
    } else {
      setRecipient('');
    }
  };

  const handleDeleteSouvenir = async (id) => {
    try {
      const res = await fetch(`/api/souvenirs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchSouvenirs();
      }
    } catch (err) {
      console.error('Error deleting souvenir:', err);
    }
  };

  return (
    <div className="grid-layout">
      {/* Left side */}
      <div>
        {/* Manage People Card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title">
            <Users size={18} />
            Membres du voyage (Destinataires)
          </h2>
          <form onSubmit={handleAddPerson} style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <div className="form-row">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom de la personne"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem' }} disabled={personLoading}>
                  +
                </button>
              </div>
            </div>
          </form>

          {/* Simple Inline List of People */}
          {people.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Aucune personne ajoutée pour l'instant.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto', padding: '0.25rem' }}>
              {people.map((person) => (
                <div
                  key={person.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  <span>{person.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeletePerson(person.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-error)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Souvenir Card */}
        <div className="card">
          <h2 className="card-title">
            <Gift size={18} />
            {editingId ? 'Modifier le souvenir' : 'Ajouter un souvenir'}
          </h2>
          <form onSubmit={handleAddSouvenir}>
            <div className="form-group">
              <label>Nom du souvenir</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: Magnet Merlion, Café local"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Destinataire</label>
              {people.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  Veuillez d'abord ajouter une personne ci-dessus.
                </div>
              ) : (
                <select
                  className="form-control"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || people.length === 0}
              >
                {loading ? 'Enregistrement...' : (editingId ? 'Modifier' : 'Ajouter')}
              </button>
              {editingId && (
                <button type="button" className="btn" onClick={cancelEdit} style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right side: list */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Cadeaux & souvenirs</h3>
        {souvenirs.length === 0 ? (
          <div className="empty-state">
            Aucun souvenir enregistré.
          </div>
        ) : (
          <div className="list-container">
            {souvenirs.map((souvenir) => (
              <div key={souvenir.id} className="list-item">
                <div className="list-item-info">
                  <span className="list-item-title">{souvenir.name}</span>
                  <div className="list-item-subtitle">
                    Destinataire : <span style={{ fontWeight: 600 }}>{souvenir.recipient}</span>
                  </div>
                </div>
                <div className="list-item-action">
                  <button
                    onClick={() => startEdit(souvenir)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSouvenir(souvenir.id)}
                    className="btn-danger"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
