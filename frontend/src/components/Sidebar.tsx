'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-ből az aktuális szűrők
  const category = searchParams.get('category') || 'all';
  const priceFromUrl = searchParams.get('price') || '500000';

  const [localPrice, setLocalPrice] = useState(priceFromUrl);

  // csúszka update
  useEffect(() => {
    setLocalPrice(priceFromUrl);
  }, [priceFromUrl]);

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Kategória szűrő*/}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Alkatrész típus</h4>
        <select 
          className={styles.selectInput}
          value={category}
          onChange={(e) => updateUrl({ category: e.target.value })}
        >
          <option value="all">Összes kategória</option>
          <option value="Engine">Motor (Engine)</option>
          <option value="Suspension">Futómű (Suspension)</option>
          <option value="Brakes">Fékrendszer (Brakes)</option>
          <option value="Exhaust">Kipufogó (Exhaust)</option>
          <option value="Body">Karosszéria (Body)</option>
        </select>
      </div>

      {/* Ár szűrő */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Maximális ár</h4>
        <input 
          type="range" min="1000" max="500000" step="1000"
          value={localPrice}
          className={styles.priceRange}
          onChange={(e) => setLocalPrice(e.target.value)}
          onMouseUp={() => updateUrl({ price: localPrice })} 
        />
        <div className={styles.priceLabel}>
          <span className="text-danger fw-bold">
            {parseInt(localPrice).toLocaleString('hu-HU')} Ft
          </span>
        </div>
      </div>

        {/* reset gomb */}
      <button className={styles.resetBtn} onClick={() => router.push('?')}>
        Szűrők törlése
      </button>
    </aside>
  );
}