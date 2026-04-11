'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './CarFilter.module.css';

export default function CarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [model, setModel] = useState(searchParams.get('model') || '');
  const [type, setType] = useState(searchParams.get('type') || '');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (model) params.set('model', model);
    if (type) params.set('type', type);
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className={styles.filterContainer}>
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label className={styles.label}>Modell</label>
          <select className={styles.select} value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="">Összes modell</option>
            <option value="Focus">Focus</option>
            <option value="Mustang">Mustang</option>
            <option value="Fiesta">Fiesta</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className={styles.label}>Kivitel típusa</label>
          <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Bármilyen kivitel</option>
            <option value="street">Utcai</option>
            <option value="track">Pálya</option>
          </select>
        </div>
        <div className="col-md-4">
          <button onClick={handleSearch} className="btn btn-danger w-100 fw-bold">JÁRMŰVEK SZŰRÉSE</button>
        </div>
      </div>
    </div>
  );
}