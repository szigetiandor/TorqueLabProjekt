'use client';
import { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { apiRequest } from '@/lib/api';

export default function AdminDashboard() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MODAL ÁLLAPOTOK ---
  const [showModal, setShowModal] = useState(false);
  const [newPart, setNewPart] = useState({
    name: '',
    manufacturer: '',
    part_number: '',
    price: 0,
    stock_quantity: 0,
    description: ''
  });

  // 1. ADATOK LEKÉRÉSE (READ)
  const fetchParts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/parts');
      setParts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // 2. ÚJ ALKATRÉSZ MENTÉSE (CREATE)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const createdPart = await apiRequest('/parts', {
        method: 'POST',
        body: JSON.stringify(newPart)
      });
      
      setParts([...parts, createdPart]);
      setShowModal(false);
      alert('Alkatrész sikeresen hozzáadva!');
      
      setNewPart({ name: '', manufacturer: '', part_number: '', price: 0, stock_quantity: 0, description: '' });
    } catch (err) {
      alert('Hiba a mentés során: ' + err.message);
    }
  };

  // 3. TÖRLÉS FUNKCIÓ (DELETE)
  const handleDelete = async (id) => {
    if (!confirm('Biztosan törölni szeretnéd ezt az alkatrészt?')) return;

    try {
      await apiRequest(`/parts/${id}`, { method: 'DELETE' });
      setParts(parts.filter(part => part.part_id !== id));
      alert('Alkatrész sikeresen törölve!');
    } catch (err) {
      alert('Hiba a törlés során: ' + err.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: '100px', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-white fw-bold">Készlet <span className="text-danger">Kezelés</span></h1>
        {/* MODAL NYITÓ GOMB */}
        <button 
          className="btn btn-danger fw-bold px-4 shadow" 
          onClick={() => setShowModal(true)}
        >
          + ÚJ ALKATRÉSZ
        </button>
      </div>

      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">
          <strong>Hiba:</strong> {error}
        </div>
      )}

      <div className="card bg-dark border-secondary shadow-lg">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr className="text-danger border-bottom border-danger">
                <th>ID</th>
                <th>Megnevezés</th>
                <th>Gyártó</th>
                <th>Ár</th>
                <th>Készlet</th>
                <th className="text-end">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="spinner-border text-danger" role="status"></div>
                    <p className="mt-2 text-secondary">Készlet betöltése...</p>
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-secondary">
                    Nem található alkatrész az adatbázisban.
                  </td>
                </tr>
              ) : (
                parts.map((part) => (
                  <tr key={part.part_id} className="align-middle">
                    <td className="text-secondary small">#{part.part_id}</td>
                    <td className="fw-bold">{part.name}</td>
                    <td>{part.manufacturer}</td>
                    <td>{Number(part.price).toLocaleString()} Ft</td>
                    <td>
                      <span className={`badge ${part.stock_quantity > 0 ? 'bg-success' : 'bg-danger'} bg-opacity-75`}>
                        {part.stock_quantity} db
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-info me-2">Szerkesztés</button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(part.part_id)}
                      >
                        Törlés
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ÚJ ALKATRÉSZ MODAL --- */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-danger shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">ÚJ <span className="text-danger">ALKATRÉSZ</span> HOZZÁADÁSA</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="small text-secondary fw-bold text-uppercase">Alkatrész neve</label>
                    <input type="text" className="form-control bg-black text-white border-secondary" 
                      onChange={(e) => setNewPart({...newPart, name: e.target.value})} required />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="small text-secondary fw-bold">Gyártó</label>
                      <input type="text" className="form-control bg-black text-white border-secondary" 
                        onChange={(e) => setNewPart({...newPart, manufacturer: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="small text-secondary fw-bold">Cikkszám</label>
                      <input type="text" className="form-control bg-black text-white border-secondary" 
                        onChange={(e) => setNewPart({...newPart, part_number: e.target.value})} required />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="small text-secondary fw-bold">Ár (Ft)</label>
                      <input type="number" className="form-control bg-black text-white border-secondary" 
                        onChange={(e) => setNewPart({...newPart, price: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="small text-secondary fw-bold">Raktárkészlet (db)</label>
                      <input type="number" className="form-control bg-black text-white border-secondary" 
                        onChange={(e) => setNewPart({...newPart, stock_quantity: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Mégse</button>
                  <button type="submit" className="btn btn-danger px-4 fw-bold">Mentés az adatbázisba</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}