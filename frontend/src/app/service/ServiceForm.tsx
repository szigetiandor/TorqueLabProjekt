'use client';
import { useState, useEffect } from 'react';
import styles from './Service.module.css';
import apiRequest from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function ServiceForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableParts, setAvailableParts] = useState<any[]>([]);
  const [selectedParts, setSelectedParts] = useState<number[]>([]);

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

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const data = await apiRequest('/parts');
        if (data) {
          setAvailableParts(data);
        }
      } catch (err) {
        console.error(`Nem sikerült betölteni az alkatrészeket: ${err.message}`);
      }
    };

    fetchParts();
  }, []);

  const handlePartToggle = (partId: number) => {
    setSelectedParts(prev => 
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Ha elváltunk a tuningtól, ürítsük a válogatást
    if (name === 'service_type' && value !== 'tuning') {
        setSelectedParts([]);
    }
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

      const serviceData = await serviceResponse.json();

      if (!serviceResponse.ok) {
        console.log(serviceData)
        throw new Error(`Az autó rögzítve, de a szerviznapló hibába ütközött.`);
      }

      const newServiceId = serviceData.service_id;

      if (formData.service_type === 'tuning' && selectedParts.length > 0) {
        // Létrehozzuk a kérések listáját
        const partPromises = selectedParts.map(partId => {
          // Megkeressük az alkatrész adatait (ár), hogy elküldhessük a kontrollernek
          const partInfo = availableParts.find(p => p.part_id === partId);
          
          return fetch(`${API_URL}/service-parts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: newServiceId,
              part_id: partId,
              quantity: 1, // Tuningnál alapértelmezett 1 db
              unit_price: partInfo ? partInfo.price : 0
            }),
            credentials: 'include',
          });
        });

        // Megvárjuk, amíg az összes alkatrész kérése lefut
        const partResults = await Promise.all(partPromises);
        
        // Ellenőrizzük, volt-e hiba köztük
        const failed = partResults.filter(r => !r.ok);
        if (failed.length > 0) {
          console.warn(`${failed.length} alkatrészt nem sikerült rögzíteni.`);
        }
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

{/* PARTS */}
          {formData.service_type === 'tuning' && (
  <div className="mb-4 p-3 bg-black bg-opacity-25 rounded border border-secondary shadow-sm">
    <label className={`${styles.label} text-danger d-block mb-3`}>
      Választható Tuning Alkatrészek
    </label>
    <div className="row g-3"> {/* Kicsit nagyobb gap (g-3) a kártyáknak jobban áll */}
      {availableParts.length > 0 ? (
        availableParts.map((part) => {
          // Összefésüljük az API adatokat a Product interface-szel
          const productData = {
            part_id: part.part_id,
            name: part.part_name || part.name, // Kezeli mindkét elnevezést
            manufacturer: part.manufacturer || 'Tuning Part',
            part_number: part.part_number || 'N/A',
            price: part.price,
            stock_quantity: part.stock_quantity || 0,
            description: part.description || '',
            image: part.image
          };

          const isSelected = selectedParts.includes(part.part_id);

          return (
            <div key={part.part_id} className="col-md-6 col-lg-4">
              <div 
                onClick={() => handlePartToggle(part.part_id)}
                className={`h-100 rounded transition-all ${
                  isSelected 
                    ? 'ring-2 ring-danger border-danger shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'opacity-75 hover:opacity-100'
                }`}
                style={{ 
                  cursor: 'pointer',
                  outline: isSelected ? '2px solid #dc3545' : 'none',
                  transition: '0.2s all ease-in-out'
                }}
              >
                {/* Itt hívjuk meg az eredeti kártyádat */}
                <ProductCard product={productData} />
                
                {/* Vizuális indikátor a kijelöléshez */}
                {isSelected && (
                  <div className="text-center bg-danger text-white small fw-bold py-1 rounded-bottom">
                    KIVÁLASZTVA
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-12 text-secondary small text-center py-4">
          <span className="spinner-border spinner-border-sm me-2"></span>
          Alkatrészek betöltése...
        </div>
      )}
    </div>
  </div>
)}
{/* PARTS VÉGE */}
          
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