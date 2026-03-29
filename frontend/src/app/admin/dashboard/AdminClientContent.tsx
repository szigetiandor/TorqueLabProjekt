'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

type AdminView = 'parts' | 'users' | 'cars' | 'logs';

export default function AdminClientContent({ initialUser }: { initialUser: any }) {
  const [activeView, setActiveView] = useState<AdminView>('parts');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    resetForm();
    fetchData();
  }, [activeView]);

  const resetForm = () => {
    if (activeView === 'parts') {
      setFormData({ name: '', manufacturer: '', part_number: '', price: 0, stock_quantity: 0, description: '' });
    } else if (activeView === 'users') {
      setFormData({ name: '', email: '', password: '', is_admin: 0 });
    } else if (activeView === 'cars') {
      setFormData({ vin: '', brand: '', model: '', production_year: new Date().getFullYear(), engine: '', mileage: 0, owner_id: '' });
    } else if (activeView === 'logs') {
      setFormData({ car_id: '', description: '', performed_by: '', service_date: new Date().toISOString().split('T')[0] });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `/${activeView === 'logs' ? 'service_log' : activeView}`;
      const result = await apiRequest(endpoint);
      setData(result);
    } catch (err) {
      console.error("Lekérdezési hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingItem;
      const method = isEditing ? 'PUT' : 'POST';
      const idKey = activeView === 'parts' ? 'part_id' : 
                    activeView === 'users' ? 'user_id' : 
                    activeView === 'cars' ? 'car_id' : 'log_id';

      const endpoint = `/${activeView === 'logs' ? 'service_log' : activeView}${isEditing ? `/${editingItem[idKey]}` : ''}`;
      
      const payload = { ...formData };
      
      if (isEditing && activeView === 'users' && (!payload.password || payload.password.trim() === "")) {
        delete payload.password;
      }

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(payload)
      });
      
      setShowModal(false);
      setEditingItem(null);
      fetchData();
      alert("Sikeres mentés!");
    } catch (err: any) {
      console.error("Mentési hiba:", err);
      alert(`Hiba a mentés során: ${err.message}`);
    }
  };

  const handleDelete = async (item: any) => {
    const idKey = activeView === 'parts' ? 'part_id' : 
                  activeView === 'users' ? 'user_id' : 
                  activeView === 'cars' ? 'car_id' : 'log_id';
    
    const id = item[idKey];
    if (!id) return alert("Hiba: Nincs azonosító!");

    if (!confirm(`Biztosan törölni szeretnéd ezt a tételt? (ID: ${id})`)) return;

    try {
      const endpoint = `/${activeView === 'logs' ? 'service_log' : activeView}/${id}`;
      await apiRequest(endpoint, { method: 'DELETE' });
      fetchData();
      alert("Sikeresen törölve!");
    } catch (err: any) {
      console.error("Törlési hiba:", err);
      if (err.message.includes("REFERENCE constraint")) {
        alert("Hiba: Ez az elem nem törölhető, mert hivatkoznak rá!");
      } else {
        alert(`Hiba a törlés során: ${err.message}`);
      }
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    if (activeView === 'users') {
        setFormData({ ...item, password: '' }); 
    } else {
        setFormData({ ...item });
    }
    setShowModal(true);
  };

  return (
    <div className="container-fluid g-0 d-flex" style={{ marginTop: '80px', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <div className="bg-dark border-end border-secondary p-3 shadow" style={{ width: '260px' }}>
        <div className="mb-4 px-2">
            <h6 className="text-danger fw-bold text-uppercase m-0">TorqueLab Admin</h6>
            <small className="text-secondary opacity-50">Szia, {initialUser.name}!</small>
        </div>
        
        <div className="nav flex-column gap-2">
          <button className={`nav-link w-100 text-start btn ${activeView === 'parts' ? 'btn-danger shadow' : 'text-white border-0'}`} onClick={() => setActiveView('parts')}>📦 Alkatrészek</button>
          <button className={`nav-link w-100 text-start btn ${activeView === 'users' ? 'btn-danger shadow' : 'text-white border-0'}`} onClick={() => setActiveView('users')}>👥 Felhasználók</button>
          <button className={`nav-link w-100 text-start btn ${activeView === 'cars' ? 'btn-danger shadow' : 'text-white border-0'}`} onClick={() => setActiveView('cars')}>🚗 Járművek</button>
          <button className={`nav-link w-100 text-start btn ${activeView === 'logs' ? 'btn-danger shadow' : 'text-white border-0'}`} onClick={() => setActiveView('logs')}>📋 Szerviz Napló</button>
        </div>
      </div>

      {/* TARTALOM */}
      <div className="flex-grow-1 p-4 bg-black text-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0 text-capitalize">{activeView === 'logs' ? 'Szerviz Napló' : activeView} Kezelése</h2>
          <button className="btn btn-danger px-4 fw-bold rounded-pill shadow" onClick={() => { setEditingItem(null); resetForm(); setShowModal(true); }}>
            + ÚJ {activeView.toUpperCase().replace(/S$/, '')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
        ) : (
          <div className="table-responsive rounded-4 border border-secondary overflow-hidden">
            <table className="table table-dark table-hover m-0 align-middle" style={{ fontSize: '0.9rem' }}>
              <thead className="text-secondary small text-uppercase bg-dark">
                <tr>
                  {activeView === 'parts' && (
                    <><th className="ps-4">Alkatrész / Cikkszám</th><th>Gyártó</th><th>Leírás</th><th>Ár</th><th>Készlet</th></>
                  )}
                  {activeView === 'users' && (
                    <><th className="ps-4">Név / ID</th><th>Email</th><th>Jogkör</th></>
                  )}
                  {activeView === 'cars' && (
                    <><th className="ps-4">Jármű (Márka/Modell/Motor)</th><th>VIN</th><th>Év / KM</th><th>Tulaj ID</th></>
                  )}
                  {activeView === 'logs' && (
                    <><th className="ps-4">Log ID / Autó</th><th>Leírás</th><th>Szerelő</th><th>Dátum</th></>
                  )}
                  <th className="text-end pe-4">Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} className="border-secondary border-opacity-10">
                    {activeView === 'parts' && (
                      <><td className="ps-4"><div className="fw-bold">{item.name}</div><div className="text-secondary small font-monospace">{item.part_number}</div></td><td>{item.manufacturer}</td><td className="text-truncate" style={{ maxWidth: '180px' }}>{item.description}</td><td className="text-danger fw-bold">{Number(item.price).toLocaleString()} Ft</td><td><span className={`badge ${item.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>{item.stock_quantity} db</span></td></>
                    )}
                    {activeView === 'users' && (
                      <><td className="ps-4"><div className="fw-bold">{item.name}</div><div className="text-secondary small">ID: #{item.user_id}</div></td><td>{item.email}</td><td>{item.is_admin ? <span className="badge bg-danger">ADMIN</span> : <span className="badge bg-secondary">USER</span>}</td></>
                    )}
                    {activeView === 'cars' && (
                      <><td className="ps-4"><div className="fw-bold">{item.brand} {item.model}</div><div className="text-danger small fw-bold">{item.engine}</div></td><td className="text-uppercase font-monospace small">{item.vin}</td><td><div>{item.production_year}</div><div className="text-secondary small">{Number(item.mileage).toLocaleString()} km</div></td><td>{item.owner_id ? `#${item.owner_id}` : '---'}</td></>
                    )}
                    {activeView === 'logs' && (
                      <><td className="ps-4"><div className="fw-bold">#{item.log_id}</div><div className="text-danger small">Autó ID: {item.car_id}</div></td><td>{item.description}</td><td>{item.performed_by}</td><td>{new Date(item.service_date).toLocaleDateString()}</td></>
                    )}
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-light border-0 me-2" onClick={() => openEdit(item)}>Szerkeszt</button>
                      <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(item)}>Törlés</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DINAMIKUS MODAL */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-secondary text-white shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-secondary">
                  <h5 className="fw-bold m-0">{editingItem ? 'Szerkesztés' : 'Új hozzáadása'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  
                  {activeView === 'parts' && (
                    <div className="row g-3">
                      <div className="col-12"><label className="small text-secondary fw-bold">Alkatrész neve *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold">Cikkszám *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.part_number || ''} onChange={(e) => setFormData({...formData, part_number: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold">Leírás *</label><textarea className="form-control bg-black text-white border-secondary shadow-none" rows={2} value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold">Gyártó</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.manufacturer || ''} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold">Készlet</label><input type="number" className="form-control bg-black text-white border-secondary shadow-none" value={formData.stock_quantity || 0} onChange={(e) => setFormData({...formData, stock_quantity: Number(e.target.value)})} /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold">Ár (Ft) *</label><input type="number" className="form-control bg-black text-white border-secondary shadow-none text-danger fw-bold" value={formData.price || 0} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required /></div>
                    </div>
                  )}

                  {activeView === 'users' && (
                    <div className="row g-3">
                      <div className="col-12"><label className="small text-secondary fw-bold">Teljes név *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold">Email cím *</label><input type="email" className="form-control bg-black text-white border-secondary shadow-none" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
                      <div className="col-12">
                        <label className="small text-secondary fw-bold">Jelszó {!editingItem && '*'}</label>
                        <input type="password" className="form-control bg-black text-white border-secondary shadow-none" placeholder={editingItem ? "Hagyd üresen, ha nem változik" : "Minimum 6 karakter"} value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!editingItem} />
                      </div>
                      <div className="col-12"><div className="form-check form-switch mt-2"><input className="form-check-input" type="checkbox" checked={!!formData.is_admin} onChange={(e) => setFormData({...formData, is_admin: e.target.checked ? 1 : 0})} /><label className="form-check-label text-secondary small fw-bold">Adminisztrátori jogkör</label></div></div>
                    </div>
                  )}

                  {activeView === 'cars' && (
                    <div className="row g-3">
                      <div className="col-12"><label className="small text-secondary fw-bold">VIN *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.vin || ''} onChange={(e) => setFormData({...formData, vin: e.target.value})} required /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold">Márka *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.brand || ''} onChange={(e) => setFormData({...formData, brand: e.target.value})} required /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold">Modell *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.model || ''} onChange={(e) => setFormData({...formData, model: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold">Motor típus *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.engine || ''} onChange={(e) => setFormData({...formData, engine: e.target.value})} required /></div>
                      <div className="col-4"><label className="small text-secondary fw-bold">Évjárat</label><input type="number" className="form-control bg-black text-white border-secondary shadow-none" value={formData.production_year || 2024} onChange={(e) => setFormData({...formData, production_year: Number(e.target.value)})} /></div>
                      <div className="col-4"><label className="small text-secondary fw-bold">KM</label><input type="number" className="form-control bg-black text-white border-secondary shadow-none" value={formData.mileage || 0} onChange={(e) => setFormData({...formData, mileage: Number(e.target.value)})} /></div>
                      <div className="col-4"><label className="small text-secondary fw-bold">Tulaj ID</label><input type="number" className="form-control bg-black text-white border-secondary shadow-none" value={formData.owner_id || ''} onChange={(e) => setFormData({...formData, owner_id: e.target.value ? Number(e.target.value) : ''})} /></div>
                    </div>
                  )}

                  {activeView === 'logs' && (
                    <div className="row g-3">
                      <div className="col-6"><label className="small text-secondary fw-bold">Autó ID *</label><input type="number" className="form-control bg-black text-white border-secondary shadow-none" value={formData.car_id || ''} onChange={(e) => setFormData({...formData, car_id: e.target.value})} required /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold">Szerelő neve *</label><input type="text" className="form-control bg-black text-white border-secondary shadow-none" value={formData.performed_by || ''} onChange={(e) => setFormData({...formData, performed_by: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold">Leírás *</label><textarea className="form-control bg-black text-white border-secondary shadow-none" rows={3} value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold">Dátum</label><input type="date" className="form-control bg-black text-white border-secondary shadow-none" value={formData.service_date || ''} onChange={(e) => setFormData({...formData, service_date: e.target.value})} /></div>
                    </div>
                  )}

                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="submit" className="btn btn-danger w-100 fw-bold py-2 shadow">MENTÉS</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}