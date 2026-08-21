import React, { useState, useEffect } from 'react';
import { MapPin, Trash2, Edit2 } from 'lucide-react';

export default function ActivitiesTab() {
  const [activities, setActivities] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (Array.isArray(data)) {
        setActivities(data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!name || !location) return;

    setLoading(true);
    try {
      const url = editingId ? `/api/activities/${editingId}` : '/api/activities';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location })
      });
      if (res.ok) {
        setName('');
        setLocation('');
        setEditingId(null);
        fetchActivities();
      }
    } catch (err) {
      console.error('Error saving activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (activity) => {
    setEditingId(activity.id);
    setName(activity.name);
    setLocation(activity.location);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setLocation('');
  };

  const handleToggleVisited = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: !currentStatus })
      });
      if (res.ok) {
        fetchActivities();
      }
    } catch (err) {
      console.error('Error toggling visited status:', err);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchActivities();
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  return (
    <div className="grid-layout">
      {/* Form Card */}
      <div>
        <div className="card">
          <h2 className="card-title">
            <MapPin size={18} />
            {editingId ? 'Modifier l\'activité' : 'Ajouter une activité'}
          </h2>
          <form onSubmit={handleAddActivity}>
            <div className="form-group">
              <label>Nom de l'activité</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: Visite des Gardens by the Bay"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Lieu / Ville</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ex: Singapour, Kuala Lumpur"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
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

      {/* Activities List */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Activités prévues</h3>
        {activities.length === 0 ? (
          <div className="empty-state">
            Aucune activité enregistrée.
          </div>
        ) : (
          <div className="list-container">
            {activities.map((activity) => (
              <div key={activity.id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={activity.visited}
                    onChange={() => handleToggleVisited(activity.id, activity.visited)}
                  />
                  <div className="list-item-info">
                    <span 
                      className="list-item-title" 
                      style={{ 
                        textDecoration: activity.visited ? 'line-through' : 'none', 
                        color: activity.visited ? 'var(--text-muted)' : 'inherit' 
                      }}
                    >
                      {activity.name}
                    </span>
                    <div className="list-item-subtitle">
                      <MapPin size={12} style={{ marginRight: '0.1rem' }} />
                      <span>{activity.location}</span>
                      <span>•</span>
                      {activity.visited ? (
                        <span className="badge badge-visited">Visité</span>
                      ) : (
                        <span className="badge badge-pending">À visiter</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="list-item-action">
                  <button
                    onClick={() => startEdit(activity)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
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
