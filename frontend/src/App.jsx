import React, { useState } from 'react';
import ExpensesTab from './components/ExpensesTab';
import SouvenirsTab from './components/SouvenirsTab';
import ActivitiesTab from './components/ActivitiesTab';
import { CreditCard, Gift, MapPin, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('expenses');

  return (
    <div className="app-container">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Compass size={32} strokeWidth={1.5} />
          <h1>MYSG 2K26</h1>
        </div>
        <p>Family trip</p>
      </header>

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <CreditCard size={16} />
          Dépenses
        </button>
        <button
          className={`tab-button ${activeTab === 'souvenirs' ? 'active' : ''}`}
          onClick={() => setActiveTab('souvenirs')}
        >
          <Gift size={16} />
          Souvenirs
        </button>
        <button
          className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          <MapPin size={16} />
          Activités
        </button>
      </div>

      <main>
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'souvenirs' && <SouvenirsTab />}
        {activeTab === 'activities' && <ActivitiesTab />}
      </main>
    </div>
  );
}
