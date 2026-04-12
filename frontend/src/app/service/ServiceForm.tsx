'use client';
import { useState } from 'react';
import styles from './Service.module.css';

export default function ServiceForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kiterjesztett state a séma szerint
  const [formData, setFormData] = useState({
    vin: '',
    brand: '',
    model: '',
    production_year: new Date().getFullYear(),
    engine: '',
    mileage: '',
    service_type: 'tuning',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Kliensoldali validáció
  const validateForm = () => {
    if (formData.vin.length !== 17) {
      setError("A VIN azonosítónak (Motorkód) pontosan 17 karakternek kell lennie!");
      return false;
    }
    if (formData.production_year < 1900 || formData.production_year > new Date().getFullYear() + 1) {
      setError("Érvénytelen gyártási év!");
      return false;
    }
    if (Number(formData.mileage) < 0) {
      setError("A futásteljesítmény nem lehet negatív!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      // 1. AUTÓ LÉTREHOZÁSA (A séma minden kötelező mezőjével)
      const carResponse = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: formData.vin.toUpperCase(),
          brand: formData.brand,
          model: formData.model,
          production_year: Number(formData.production_year),
          engine: formData.engine,
          mileage: Number(formData.mileage),
          for_sale: 0, // Alapértelmezett a séma szerint
          price: 0
        }),
        credentials: 'include',
      });

      const carData = await carResponse.json();
      if (!carResponse.ok) throw new Error(carData.error || 'Hiba az autó rögzítésekor (lehet, hogy a VIN már létezik).');

      // 2. SZERVIZNAPLÓ LÉTREHOZÁSA
      const serviceResponse = await fetch(`${API_URL}/service-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: carData.car_id,
          service_date: new Date().toISOString().split('T')[0],
          description: `[${formData.service_type.toUpperCase()}] ${formData.description}`
        }),
        credentials: 'include',
      });

      if (!serviceResponse.ok) {
        const resp = await serviceResponse.json()
        console.log(resp)
        throw new Error(`Az autó rögzítve, de a szerviznapló hibába ütközött.`);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-5">
        <h3 className="text-danger mb-3">Sikeres igénylés!</h3>
        <p>A járművet és a szervizigényt rögzítettük. Hamarosan jelentkezünk!</p>
        <button onClick={() => setSuccess(false)} className={styles.submitBtn}>ÚJ FOGLALÁS</button>
      </div>
    );
  }

  return (
    <form className={styles.serviceForm} onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger border-0 mb-4 shadow-sm text-center">⚠️ {error}</div>}
      
      <div className="row g-3">
        {/* Jármű adatok */}
        <div className="col-md-6">
          <label className={styles.label}>Márka (pl. Ford)</label>
          <input name="brand" type="text" className="form-control" value={formData.brand} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className={styles.label}>Modell (pl. Focus RS)</label>
          <input name="model" type="text" className="form-control" value={formData.model} onChange={handleChange} required />
        </div>

        <div className="col-md-12">
          <label className={styles.label}>VIN / Alvázszám (Motorkód - 17 karakter)</label>
          <input 
            name="vin" 
            type="text" 
            className={`form-control ${formData.vin.length > 0 && formData.vin.length !== 17 ? 'is-invalid' : ''}`}
            placeholder="Azonosító kód" 
            maxLength={17}
            value={formData.vin} 
            onChange={handleChange} 
            required 
          />
          <div className="form-text text-secondary">Karakterek száma: {formData.vin.length}/17</div>
        </div>

        <div className="col-md-4">
          <label className={styles.label}>Gyártási év</label>
          <input name="production_year" type="number" className="form-control" value={formData.production_year} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className={styles.label}>Motor típus</label>
          <input name="engine" type="text" className="form-control" value={formData.engine} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className={styles.label}>Kilométeróra állása</label>
          <input name="mileage" type="number" className="form-control" value={formData.mileage} onChange={handleChange} />
        </div>

        {/* Szolgáltatás adatok */}
        <div className="col-12 mt-4">
          <label className={styles.label}>Szolgáltatás típusa</label>
          <select name="service_type" className="form-select mb-3" value={formData.service_type} onChange={handleChange}>
            <option value="tuning">Teljesítmény Tuning / Optimalizálás</option>
            <option value="maintenance">Időszakos Szerviz</option>
            <option value="repair">Mechanikai Javítás</option>
            <option value="diag">Diagnosztika</option>
          </select>
          
          <label className={styles.label}>Részletes leírás</label>
          <textarea 
            name="description"
            className="form-control" 
            rows={4} 
            placeholder="Kérjük részletezze igényét..."
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="col-12 text-center mt-4">
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'IGÉNY LEADÁSA'}
          </button>
        </div>
      </div>
    </form>
  );
}