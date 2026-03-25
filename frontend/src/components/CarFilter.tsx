'use client';

import styles from './CarFilter.module.css';

export default function CarFilter() {
  return (
    <div className={styles.filterContainer}>
      <div className="row g-3 align-items-end">
        
        {/* MODELL SZŰRŐ */}
        <div className="col-md-4">
          <label className={styles.label}>Modell</label>
          <select className={styles.select}>
            <option value="">Összes modell</option>
            <option value="focus-rs">Focus RS</option>
            <option value="focus-st">Focus ST</option>
            <option value="mustang">Mustang GT / Dark Horse</option>
            <option value="fiesta-st">Fiesta ST</option>
            <option value="raptor">F-150 Raptor</option>
          </select>
        </div>

        {/* ÁLLAPOT / KATEGÓRIA */}
        <div className="col-md-4">
          <label className={styles.label}>Kivitel típusa</label>
          <select className={styles.select}>
            <option value="">Bármilyen kivitel</option>
            <option value="street">Utcai (Street Legal)</option>
            <option value="track">Pálya (Track Ready)</option>
            <option value="drag">Gyorsulási (Drag Spec)</option>
          </select>
        </div>

        {/* KERESÉS GOMB */}
        <div className="col-md-4">
          <button className="btn btn-danger w-100 fw-bold text-uppercase py-2" style={{borderRadius: '6px'}}>
            Járművek szűrése
          </button>
        </div>

      </div>
    </div>
  );
}