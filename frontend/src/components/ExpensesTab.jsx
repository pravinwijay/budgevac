import React, { useState, useEffect } from 'react';
import { CreditCard, Trash2, RefreshCw, Edit2 } from 'lucide-react';

const CATEGORIES = ['Logement', 'Transport', 'Nourriture', 'Loisirs', 'Achats', 'Autre'];
const CURRENCIES = ['EUR', 'MYR', 'SGD'];

// Rates relative to 1 EUR
const EXCHANGE_RATES = {
  EUR: 1.0,
  SGD: 1.45,
  MYR: 4.75
};

export default function ExpensesTab() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Converter state
  const [convertAmount, setConvertAmount] = useState('10');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('SGD');
  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    handleConversion();
  }, [convertAmount, fromCurrency, toCurrency]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      if (Array.isArray(data)) {
        setExpenses(data);
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    setLoading(true);
    try {
      const url = editingId ? `/api/expenses/${editingId}` : '/api/expenses';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          currency,
          category
        })
      });
      if (res.ok) {
        setDescription('');
        setAmount('');
        setEditingId(null);
        fetchExpenses();
      }
    } catch (err) {
      console.error('Error saving expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount);
    setCurrency(expense.currency);
    setCategory(expense.category);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setCurrency('EUR');
    setCategory(CATEGORIES[0]);
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchExpenses();
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const handleConversion = () => {
    const amt = parseFloat(convertAmount) || 0;
    if (amt === 0) {
      setConvertedValue(0);
      return;
    }
    // Convert fromCurrency to EUR reference, then to target currency
    const eurVal = amt / EXCHANGE_RATES[fromCurrency];
    const finalVal = eurVal * EXCHANGE_RATES[toCurrency];
    setConvertedValue(finalVal.toFixed(2));
  };

  // Compute stats in EUR (reference currency)
  const totalInEUR = expenses.reduce((acc, curr) => {
    const rate = EXCHANGE_RATES[curr.currency];
    const amountInEUR = curr.amount / rate;
    return acc + amountInEUR;
  }, 0);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Total Dépenses (EUR)</div>
          <div className="stat-value">{totalInEUR.toFixed(2)} €</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Dépenses (SGD)</div>
          <div className="stat-value">{(totalInEUR * EXCHANGE_RATES.SGD).toFixed(2)} S$</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Dépenses (MYR)</div>
          <div className="stat-value">{(totalInEUR * EXCHANGE_RATES.MYR).toFixed(2)} RM</div>
        </div>
      </div>

      <div className="grid-layout">
        {/* Left column: Add form and Converter */}
        <div>
          <div className="card">
            <h2 className="card-title">
              <CreditCard size={18} />
              {editingId ? 'Modifier la dépense' : 'Ajouter une dépense'}
            </h2>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Dîner à Singapour"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Montant et Devise</label>
                <div className="form-row">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <select
                    className="form-control"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((cur) => (
                      <option key={cur} value={cur}>{cur}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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

          <div className="card converter-card">
            <h2 className="card-title">
              <RefreshCw size={18} />
              Convertisseur de devises
            </h2>
            <div className="form-group">
              <label>Montant</label>
              <input
                type="number"
                className="form-control"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
              />
            </div>
            <div className="converter-grid">
              <div className="form-group">
                <label>De</label>
                <select
                  className="form-control"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {CURRENCIES.map((cur) => (
                    <option key={cur} value={cur}>{cur}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vers</label>
                <select
                  className="form-control"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {CURRENCIES.map((cur) => (
                    <option key={cur} value={cur}>{cur}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="converter-result">
              <div>Résultat de conversion</div>
              <div className="converter-result-value">
                {convertedValue} {toCurrency}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Expense List */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Liste des dépenses</h3>
          {expenses.length === 0 ? (
            <div className="empty-state">
              Aucune dépense enregistrée.
            </div>
          ) : (
            <div className="list-container">
              {expenses.map((expense) => (
                <div key={expense.id} className="list-item">
                  <div className="list-item-info">
                    <span className="list-item-title">{expense.description}</span>
                    <div className="list-item-subtitle">
                      <span className="badge badge-category">{expense.category}</span>
                      <span>•</span>
                      <span>
                        {new Date(expense.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="list-item-action">
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                      {parseFloat(expense.amount).toFixed(2)}{' '}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {expense.currency}
                      </span>
                    </span>
                    <button
                      onClick={() => startEdit(expense)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
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
    </div>
  );
}
