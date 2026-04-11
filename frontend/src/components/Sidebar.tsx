'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const selectedCar = searchParams.get('car') || '';
  const priceFromUrl = searchParams.get('price') || '1500000';

  // Helyi állapot a csúszkának, hogy ne laggoljon
  const [localPrice, setLocalPrice] = useState(priceFromUrl);

  // Ha az URL-ben változik az ár, kövesse a helyi állapot is
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
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>My Vehicle</h4>
        <select 
          className={styles.selectInput}
          value={selectedCar}
          onChange={(e) => updateUrl({ car: e.target.value })}
        >
          <option value="">Select your Ford</option>
          <optgroup label="Focus">
            <option value="Focus-RS">Focus RS</option>
            <option value="Focus-ST">Focus ST</option>
          </optgroup>
          <optgroup label="Mustang">
            <option value="Mustang-GT">Mustang GT</option>
            <option value="Mustang-EcoBoost">Mustang EcoBoost</option>
          </optgroup>
          <optgroup label="Fiesta">
            <option value="Fiesta-ST">Fiesta ST</option>
          </optgroup>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Max Price</h4>
        <input 
          type="range" min="1000" max="500000" step="1000"
          value={localPrice}
          className={styles.priceRange}
          onChange={(e) => setLocalPrice(e.target.value)}
          onMouseUp={() => updateUrl({ price: localPrice })} // Csak elengedéskor frissít URL-t
        />
        <div className={styles.priceLabel}>
          <span className="text-danger fw-bold">
            {parseInt(localPrice).toLocaleString('hu-HU')} Ft
          </span>
        </div>
      </div>

      <button className={styles.resetBtn} onClick={() => router.push('?')}>
        Reset Filters
      </button>
    </aside>
  );
}