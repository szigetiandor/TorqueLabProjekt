'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
  defaultCategory?: string;
}

export default function Sidebar({ defaultCategory = 'all' }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const selectedCar = searchParams.get('car') || '';
  const price = searchParams.get('price') || '1500000';

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
      
      {/* 1. JÁRMŰ VÁLASZTÓ */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>My Vehicle</h4>
        <div className={styles.carSelectorBox}>
          <select 
            className={styles.selectInput}
            value={selectedCar}
            onChange={(e) => updateUrl({ car: e.target.value })}
          >
            <option value="">Select your Ford</option>
            <optgroup label="Focus">
              <option value="focus-rs-mk3">Focus RS Mk3 (2015-2018)</option>
              <option value="focus-st-mk4">Focus ST Mk4 (2019+)</option>
              <option value="focus-st-mk3">Focus ST Mk3 (2012-2018)</option>
            </optgroup>
            <optgroup label="Mustang">
              <option value="mustang-gt-s550">Mustang GT S550 (2015+)</option>
              <option value="mustang-eb-s550">Mustang EcoBoost S550</option>
            </optgroup>
            <optgroup label="Fiesta">
              <option value="fiesta-st-mk8">Fiesta ST Mk8 (2018+)</option>
              <option value="fiesta-st-mk7">Fiesta ST Mk7 (2013-2017)</option>
            </optgroup>
          </select>
          {selectedCar && (
            <p className="small text-success mt-2 mb-0 fw-bold">
              ✓ Showing parts for your {selectedCar.replace(/-/g, ' ').toUpperCase()}
            </p>
          )}
        </div>
      </div>

      <hr className="border-secondary opacity-25 my-4" />

      {/* 2. KATEGÓRIA VÁLASZTÓ */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Category</h4>
        <select 
          className={styles.selectInput}
          value={category}
          onChange={(e) => updateUrl({ category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="engine">Engine Tuning</option>
          <option value="suspension">Suspension</option>
          <option value="exhaust">Exhaust Systems</option>
        </select>
      </div>

      {/* 3. ÁR SZŰRŐ */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterTitle}>Max Price</h4>
        <input 
          type="range" min="10000" max="1500000" step="10000"
          value={price}
          className={styles.priceRange}
          onChange={(e) => updateUrl({ price: e.target.value })}
        />
        <div className={styles.priceLabel}>
          <span className="text-danger fw-bold" suppressHydrationWarning>
            {parseInt(price).toLocaleString('hu-HU')} Ft
          </span>
        </div>
      </div>

      {/* RESET GOMB */}
      <button 
        className={styles.resetBtn}
        onClick={() => router.push('?')} 
      >
        Reset Filters
      </button>

    </aside>
  );
}