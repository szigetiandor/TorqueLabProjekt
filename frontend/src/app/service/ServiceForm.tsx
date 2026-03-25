'use client';
import { useState } from 'react';
import styles from './Service.module.css';

export default function ServiceForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Szimulált API hívás
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="text-center py-5">
        <h3 className="text-danger mb-3">Sikeres igénylés!</h3>
        <p>Munkatársunk hamarosan keresni fogja Önt a megadott telefonszámon az időpont pontosítása miatt.</p>
        <button onClick={() => setSuccess(false)} className={styles.submitBtn}>ÚJ FOGLALÁS</button>
      </div>
    );
  }

  return (
    <form className={styles.serviceForm} onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className={styles.label}>Teljes Név</label>
          <input type="text" className="form-control" placeholder="pl. Kovács János" required />
        </div>
        <div className="col-md-6">
          <label className={styles.label}>Telefonszám</label>
          <input type="tel" className="form-control" placeholder="+36 30 123 4567" required />
        </div>

        <div className="col-md-6">
          <label className={styles.label}>Jármű Típusa</label>
          <input type="text" className="form-control" placeholder="pl. Focus RS Mk3" required />
        </div>
        <div className="col-md-6">
          <label className={styles.label}>Motor / Motorkód</label>
          <input type="text" className="form-control" placeholder="pl. 2.3 EcoBoost / YVDA" required />
        </div>

        <div className="col-12">
          <label className={styles.label}>Kért Szolgáltatás / Hiba Leírása</label>
          <select className="form-select mb-3" required defaultValue="tuning">
            <option value="tuning">Teljesítmény Tuning / Optimalizálás</option>
            <option value="maintenance">Időszakos Szerviz (Olaj, szűrők, stb.)</option>
            <option value="repair">Mechanikai Javítás</option>
            <option value="diag">Ismeretlen Hiba (Diagnosztika szükséges)</option>
          </select>
          <textarea 
            className="form-control" 
            rows={4} 
            placeholder="Kérjük, részletezze a hibát vagy a kívánt módosításokat..."
            required
          ></textarea>
        </div>

        <div className="col-12 text-center mt-4">
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'KÜLDÉS...' : 'SZERVIZIGÉNY KÜLDÉSE'}
          </button>
        </div>
      </div>
    </form>
  );
}