'use client'; // Fontos az animációhoz
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './Catalog.module.css';
import apiRequest from '@/lib/api';

export default function CatalogPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [cars, setCars] = useState<any[]>([]);

  async function getCars() {
    try {
      const res = await apiRequest(`/cars?for_sale=true`, {
        cache: 'no-store'
      });

      if (!res.ok) throw new Error('Hiba a lekérés során');
      return res.json();
    } catch (error) {
      console.error("Backend hiba:", error);
      return [];
    }
  }

  export default async function CatalogPage() {
    const cars = await getCars();
    // Kapu felnyitása 
    useEffect(() => {
      const timer = setTimeout(() => setIsOpen(true), 500);
      // Itt hivjuk be az autokat a bachendrol (fetch)
      return () => clearTimeout(timer);
    }, []);

    return (
      <main className={styles.garageScene}>
        {/* GARÁZSKAPU  */}
        <div className={`${styles.garageDoor} ${isOpen ? styles.doorOpen : ''}`}>
          <div className={styles.shutterHandle}></div>
          <div className={styles.doorLogo}>
            <img src="/logo_vegleg.png" alt="TorqueLab" />
          </div>
        </div>

        <div className={`container ${styles.contentWrapper}`}>
          <header className="text-center mb-5">
            <h1 className={styles.neonTitle}>TorqueLab<span className="text-danger"> Projektek</span></h1>
            <p className="text-secondary italic">Műhelyünkből kigurult aszfaltszaggatóink kínálata</p>
          </header>

          {/* KÁRTYA ELRENDEZÉS*/}
          <div className="row justify-content-center g-5">
            {cars.length > 0 ? (
              cars.map((car) => (
                <div key={car.car_id} className="col-12 col-xl-10">
                  <div className={styles.industrialCard}>
                    {/* ProductCard*/}
                    <div className="row g-0">
                      <div className="col-md-7">
                        <img src={car.imageUrl} alt={car.brand} className={styles.carImg} />
                      </div>
                      <div className="col-md-5 p-4 d-flex flex-column justify-content-center">
                        <div className={styles.buildBadge}>{car.build_type}</div>
                        <h2 className="h1 mb-3">{car.brand} {car.model}</h2>
                        <p className={styles.description}>{car.description}</p>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className={styles.priceTag}>{car.price} Ft</span>
                          <button className={styles.viewBtn}>Specifikációk</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Példa kártya */
              <div className="col-12 col-xl-10">
                <div className={styles.industrialCard}>
                  <div className="row g-0 text-white">
                    <div className="col-md-7">
                      <div className={styles.imgPlaceholder}>[ KÉP HELYE ]</div>
                    </div>
                    <div className="col-md-5 p-4">
                      <div className={styles.buildBadge}>Custom Build #001</div>
                      <h2>Példa Projekt Autó</h2>
                      <p className="text-secondary">Ez a kártya szélesebb, hogy jobban mutasson, ha kevés autó van.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }
}