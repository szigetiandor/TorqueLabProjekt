'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

type AdminView = 'parts' | 'users' | 'cars' | 'logs';

export default function AdminClientContent({ initialUser }: { initialUser: any }) {
  // --- ÁLLAPOTOK ---
  const [activeView, setActiveView] = useState<AdminView>('parts');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState(''); 

  // --- AUTOMATIKUS FRISSÍTÉS ---
  useEffect(() => {
    resetForm();
    fetchData();
  }, [activeView]);

  // --- SEGÉDFÜGGVÉNYEK (Logika) ---

  const getItemId = (item: any) => {
    if (!item) return null;
    const keys = ['service_id', 'part_id', 'user_id', 'car_id', 'log_id', 'service_log_id', 'id'];
    for (const key of keys) {
      if (item[key] !== undefined && item[key] !== null) return item[key];
    }
    return null;
  };

  const resetForm = () => {
    const defaultValues: Record<AdminView, any> = {
      parts: { name: '', manufacturer: '', part_number: '', price: 0, stock_quantity: 0, description: '' },
      users: { name: '', email: '', password: '', is_admin: 0 },
      cars: { vin: '', brand: '', model: '', production_year: new Date().getFullYear(), engine: '', mileage: 0, owner_id: '' },
      logs: { 
        car_id: '', 
        description: '', 
        performed_by: '', 
        service_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
    };
    setFormData(defaultValues[activeView]);
  };

  const fetchComments = async (serviceId: number) => {
    try {
      const result = await apiRequest(`/service-logs/${serviceId}/comments`);
      setComments(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Komment hiba:", err);
    }
  };

  const handleAddComment = async (serviceId: number) => {
    if (!newComment.trim()) return;
    try {
      await apiRequest(`/service-comments`, {
        method: 'POST',
        body: JSON.stringify({
          service_id: serviceId,
          by_user: initialUser.user_id, // Az aktuális admin ID-ja
          comment: newComment
        })
      });
      setNewComment('');
      fetchComments(serviceId); // Frissítés
    } catch (err) {
      alert("Hiba a komment mentésekor!");
    }
  };

  const getEndpoint = () => {
    return activeView === 'logs' ? '/service-logs' : `/${activeView}`;
  };

  // --- API HÍVÁSOK ---

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await apiRequest(getEndpoint());
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Adatlekérési hiba:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingItem ? getItemId(editingItem) : null;
      const isEditing = !!id;
      
      const baseRoute = getEndpoint();
      const finalUrl = isEditing ? `${baseRoute}/${id}` : baseRoute;
      const httpMethod = isEditing ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (isEditing && activeView === 'users' && !payload.password?.trim()) {
        delete payload.password;
      }

      await apiRequest(finalUrl, {
        method: httpMethod,
        body: JSON.stringify(payload)
      });
      
      setShowModal(false);
      setEditingItem(null);
      fetchData();
      alert("Sikeres mentés!");
    } catch (err: any) {
      // --- MAGYARNYELVŰ HIBAKEZELÉS (Lajikus szemmel) ---
      let errorMsg = err.message;

      // Alvázszám / Email ütközés
      if (errorMsg.includes("vin") && (errorMsg.includes("Duplicate") || errorMsg.includes("unique"))) {
        errorMsg = "Ez az alvázszám már szerepel a rendszerben! Kérlek, ellenőrizd az adatokat.";
      } else if (errorMsg.includes("email") && (errorMsg.includes("Duplicate") || errorMsg.includes("unique"))) {
        errorMsg = "Ez az email cím már foglalt. Kérlek, használj másikat.";
      } 
      // Kilométeróra hibák
      else if (errorMsg.includes("mileage is required")) {
        errorMsg = "A kilométeróra állás megadása kötelező!";
      } else if (errorMsg.includes("mileage") && (errorMsg.includes("too large") || errorMsg.includes("overflow"))) {
        errorMsg = "A megadott kilométer érték irreálisan magas!";
      }
      // Kapcsolati (Foreign Key) hibák - A legfontosabb rész:
      else if (errorMsg.includes("FK__service_l__perfo")) {
        errorMsg = "A megadott Munkavégző (Szerelő) ID nem létezik! Csak regisztrált felhasználó ID-ját adhatod meg.";
      } else if (errorMsg.includes("owner_id") && errorMsg.includes("FOREIGN KEY")) {
        errorMsg = "A megadott Tulajdonos ID nem található a felhasználók között.";
      } else if (errorMsg.includes("car_id") && errorMsg.includes("FOREIGN KEY")) {
        errorMsg = "A megadott Autó belső ID nem létezik a rendszerben.";
      }
      // Általános hálózati vagy szerver hiba
      else if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
        errorMsg = "Nincs kapcsolat a szerverrel. Kérlek, ellenőrizd az internetet!";
      } else {
        errorMsg = "Sajnos hiba történt a mentés során. Ellenőrizd, hogy minden mezőt megfelelően töltöttél-e ki!";
      }

      alert(errorMsg);
    }
  };

  const handleDelete = async (item: any) => {
    const id = getItemId(item);
    if (!id || !confirm(`Biztosan törölni szeretnéd a(z) ${id} azonosítójú tételt?`)) return;

    try {
      await apiRequest(`${getEndpoint()}/${id}`, { method: 'DELETE' });
      fetchData();
      alert("Tétel sikeresen törölve.");
    } catch (err: any) {
      const errorMsg = err.message.includes("REFERENCE constraint") 
        ? "Ez a tétel nem törölhető, mert más adatok (pl. szerviznapló bejegyzések vagy autók) hivatkoznak rá!" 
        : "Hiba történt a törlés során. Valószínűleg a tétel már használatban van máshol.";
      alert(errorMsg);
    }
  };

  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    
    let preparedData = { ...item };

    // Ha szerviznaplóról van szó, formázzuk a dátumot az inputnak megfelelően
    if (activeView === 'logs' && item.service_date) {
      preparedData.service_date = formatDateForInput(item.service_date);
      fetchComments(getItemId(item));
    }

    if (activeView === 'users') {
      preparedData.password = ''; // Jelszót ne töltsük be
    }

    setFormData(preparedData);
    setShowModal(true);
  };

  return (
    <div className="container-fluid g-0 d-flex" style={{ marginTop: '80px', minHeight: '100vh' }}>
      
      {/* OLDALSÁV */}
      <div className="bg-dark border-end border-secondary p-3 shadow" style={{ width: '260px' }}>
        <div className="mb-4 px-2">
            <h6 className="text-danger fw-bold text-uppercase m-0 font-monospace">TorqueLab Admin</h6>
            <small className="text-secondary opacity-50 font-monospace">Belépve: {initialUser?.name || 'Admin'}</small>
        </div>
        
        <div className="nav flex-column gap-2">
          {(['parts', 'users', 'cars', 'logs'] as AdminView[]).map((view) => (
            <button 
              key={view}
              className={`nav-link w-100 text-start btn ${activeView === view ? 'btn-danger shadow' : 'text-white border-0'}`} 
              onClick={() => setActiveView(view)}
            >
              {view === 'parts' && '📦 Alkatrészek'}
              {view === 'users' && '👥 Felhasználók'}
              {view === 'cars' && '🚗 Járművek'}
              {view === 'logs' && '📋 Szerviz Napló'}
            </button>
          ))}
        </div>
      </div>

      {/* TARTALOM TERÜLET */}
      <div className="flex-grow-1 p-4 bg-black text-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0 text-capitalize">
            {activeView === 'logs' ? 'Szerviz Napló' : 
             activeView === 'parts' ? 'Alkatrészek' : 
             activeView === 'users' ? 'Felhasználók' : 'Járművek'}
          </h2>
          <button className="btn btn-danger px-4 fw-bold rounded-pill shadow" onClick={() => { setEditingItem(null); resetForm(); setShowModal(true); }}>
            + ÚJ HOZZÁADÁSA
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-danger"></div><p className="mt-2 text-secondary">Adatok betöltése...</p></div>
        ) : (
          <div className="table-responsive rounded-4 border border-secondary overflow-hidden shadow-lg">
            <table className="table table-dark table-hover m-0 align-middle" style={{ fontSize: '0.9rem' }}>
              <thead className="text-secondary small text-uppercase bg-dark">
                <tr>
                  {activeView === 'parts' && <><th className="ps-4">Név / Cikkszám</th><th>Gyártó</th><th>Ár</th><th>Készlet</th></>}
                  {activeView === 'users' && <><th className="ps-4">Név / ID</th><th>Email</th><th>Jogkör</th></>}
                  {activeView === 'cars' && <><th className="ps-4">Jármű</th><th>VIN</th><th>Év / KM</th><th>Tulaj ID</th></>}
                  {activeView === 'logs' && <><th className="ps-4">Autó ID</th><th>Leírás</th><th>Szerelő ID</th><th>Dátum</th></>}
                  <th className="text-end pe-4">Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} className="border-secondary border-opacity-10">
                    {activeView === 'parts' && (
                      <><td className="ps-4"><div className="fw-bold">{item.name}</div><div className="text-secondary small">{item.part_number}</div></td><td>{item.manufacturer}</td><td className="text-danger fw-bold">{Number(item.price).toLocaleString()} Ft</td><td><span className={`badge ${item.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>{item.stock_quantity} db</span></td></>
                    )}
                    {activeView === 'users' && (
                      <><td className="ps-4"><div className="fw-bold">{item.name}</div><div className="text-secondary small">ID: #{getItemId(item)}</div></td><td>{item.email}</td><td>{item.is_admin ? <span className="badge bg-danger">ADMIN</span> : <span className="badge bg-secondary">FELHASZNÁLÓ</span>}</td></>
                    )}
                    {activeView === 'cars' && (
                      <><td className="ps-4"><div className="fw-bold">{item.brand} {item.model}</div><div className="text-danger small">{item.engine}</div></td><td className="font-monospace small">{item.vin}</td><td>{item.production_year} / {Number(item.mileage).toLocaleString()} km</td><td>#{item.owner_id}</td></>
                    )}
                    {activeView === 'logs' && (
                      <><td className="ps-4 fw-bold text-danger">Autó #{item.car_id}</td><td>{item.description}</td><td>Szerelő #{item.performed_by}</td><td>{new Date(item.service_date).toLocaleDateString('hu-HU')}</td></>
                    )}
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-light border-0 me-2" onClick={() => openEdit(item)}>Szerkesztés</button>
                      <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(item)}>Törlés</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADATSZERKESZTŐ MODAL */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-secondary text-white shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-secondary">
                  <h5 className="fw-bold m-0">{editingItem ? 'Adatok módosítása' : 'Új tétel felvitele'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  
                  {activeView === 'parts' && (
                    <div className="row g-3">
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Megnevezés</label><input type="text" className="form-control bg-black text-white border-secondary" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Cikkszám</label><input type="text" className="form-control bg-black text-white border-secondary" value={formData.part_number || ''} onChange={(e) => setFormData({...formData, part_number: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Leírás</label><textarea className="form-control bg-black text-white border-secondary" rows={2} value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold text-uppercase">Gyártó</label><input type="text" className="form-control bg-black text-white border-secondary" value={formData.manufacturer || ''} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold text-uppercase">Raktárkészlet</label><input type="number" className="form-control bg-black text-white border-secondary" value={formData.stock_quantity || 0} onChange={(e) => setFormData({...formData, stock_quantity: Number(e.target.value)})} /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Egységár (Ft)</label><input type="number" className="form-control bg-black text-white border-secondary" value={formData.price || 0} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required /></div>
                    </div>
                  )}

                  {activeView === 'users' && (
                    <div className="row g-3">
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Teljes név</label><input type="text" className="form-control bg-black text-white border-secondary" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Email cím</label><input type="email" className="form-control bg-black text-white border-secondary" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Jelszó</label><input type="password" className="form-control bg-black text-white border-secondary" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!editingItem} placeholder={editingItem ? 'Hagyd üresen a változatlan jelszóhoz' : ''} /></div>
                      <div className="col-12"><div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={!!formData.is_admin} onChange={(e) => setFormData({...formData, is_admin: e.target.checked ? 1 : 0})} /><label className="form-check-label text-secondary small">Adminisztrátori jogosultság</label></div></div>
                    </div>
                  )}

                  {activeView === 'cars' && (
                    <div className="row g-3">
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Alvázszám (VIN)</label><input type="text" className="form-control bg-black text-white border-secondary font-monospace" value={formData.vin || ''} onChange={(e) => setFormData({...formData, vin: e.target.value})} required /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold text-uppercase">Gyártmány</label><input type="text" className="form-control bg-black text-white border-secondary" value={formData.brand || ''} onChange={(e) => setFormData({...formData, brand: e.target.value})} required /></div>
                      <div className="col-6"><label className="small text-secondary fw-bold text-uppercase">Modell</label><input type="text" className="form-control bg-black text-white border-secondary" value={formData.model || ''} onChange={(e) => setFormData({...formData, model: e.target.value})} required /></div>
                      <div className="col-12"><label className="small text-secondary fw-bold text-uppercase">Motorkód / Típus</label><input type="text" className="form-control bg-black text-white border-secondary" value={formData.engine || ''} onChange={(e) => setFormData({...formData, engine: e.target.value})} required /></div>
                      <div className="col-4"><label className="small text-secondary fw-bold text-uppercase">Évjárat</label><input type="number" className="form-control bg-black text-white border-secondary" value={formData.production_year || 2024} onChange={(e) => setFormData({...formData, production_year: Number(e.target.value)})} /></div>
                      <div className="col-4"><label className="small text-secondary fw-bold text-uppercase">Kilométeróra</label><input type="number" className="form-control bg-black text-white border-secondary" value={formData.mileage || 0} onChange={(e) => setFormData({...formData, mileage: Number(e.target.value)})} required /></div>
                      <div className="col-4"><label className="small text-secondary fw-bold text-uppercase">Tulajdonos ID</label><input type="number" className="form-control bg-black text-white border-secondary" value={formData.owner_id || ''} onChange={(e) => setFormData({...formData, owner_id: e.target.value})} required /></div>
                    </div>
                  )}

                  {activeView === 'logs' && (
  <div className="row g-3">
    <div className="col-6">
      <label className="small text-secondary fw-bold text-uppercase">Autó belső ID</label>
      <input type="number" className="form-control bg-black text-white border-secondary" value={formData.car_id || ''} onChange={(e) => setFormData({...formData, car_id: e.target.value})} required />
    </div>
    <div className="col-6">
      <label className="small text-secondary fw-bold text-uppercase">Státusz</label>
      <select 
        className="form-select bg-black text-white border-secondary" 
        value={formData.status || 'pending'} 
        onChange={(e) => setFormData({...formData, status: e.target.value})}
      >
        <option value="pending">Függőben</option>
        <option value="in_progress">Folyamatban</option>
        <option value="completed">Elkészült</option>
        <option value="cancelled">Törölve</option>
      </select>
    </div>
    <div className="col-6">
      <label className="small text-secondary fw-bold text-uppercase">Szerviz dátuma</label>
      <input type="date" className="form-control bg-black text-white border-secondary" value={formData.service_date || ''} onChange={(e) => setFormData({...formData, service_date: e.target.value})} required />
    </div>
    <div className="col-6">
      <label className="small text-secondary fw-bold text-uppercase">Szerelő ID</label>
      <input type="number" className="form-control bg-black text-white border-secondary" value={formData.performed_by || ''} onChange={(e) => setFormData({...formData, performed_by: e.target.value})} required />
    </div>
    <div className="col-12">
      <label className="small text-secondary fw-bold text-uppercase">Leírás</label>
      <textarea className="form-control bg-black text-white border-secondary" rows={2} value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
    </div>

    {/* KOMMENT SZEKCIÓ - Csak szerkesztésnél látszik */}
    {editingItem && (
      <div className="col-12 mt-4 border-top border-secondary pt-3">
        <h6 className="text-danger fw-bold text-uppercase small mb-3">Belső Megjegyzések (Comments)</h6>
        
        <div className="bg-black rounded p-2 mb-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
          {comments.length === 0 ? (
            <small className="text-secondary d-block text-center py-2">Nincs még megjegyzés.</small>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="border-bottom border-secondary border-opacity-25 mb-2 pb-1">
                <div className="d-flex justify-content-between">
                  <span className="text-danger small fw-bold">User #{c.by_user}</span>
                </div>
                <p className="m-0 small text-light">{c.comment}</p>
              </div>
            ))
          )}
        </div>

        <div className="input-group input-group-sm">
          <input 
            type="text" 
            className="form-control bg-black text-white border-secondary" 
            placeholder="Új megjegyzés írása..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            className="btn btn-outline-danger" 
            type="button" 
            onClick={() => handleAddComment(getItemId(editingItem))}
          >
            Küldés
          </button>
        </div>
      </div>
    )}
  </div>
)}
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="submit" className="btn btn-danger w-100 fw-bold py-2 shadow">MŰVELET VÉGREHAJTÁSA</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}