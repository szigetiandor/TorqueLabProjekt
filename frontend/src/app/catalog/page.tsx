'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Catalog.module.css';
import { apiRequest, getImageUrl } from '@/lib/api';

export default function CatalogPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500);

    async function fetchCars() {
      try {
        const data = await apiRequest(`/cars?for_sale=true`, {
          cache: 'no-store'
        });
        setCars(data);
      } catch (error) {
        console.error("Backend hiba:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={styles.garageScene}>
      <div className={`${styles.garageDoor} ${isOpen ? styles.doorOpen : ''}`}>
        <div className={styles.shutterHandle}></div>
        <div className={styles.doorLogo}>
          <img src="/logo_vegleg.png" alt="TorqueLab" />
        </div>
      </div>

      <div className={`container ${styles.contentWrapper}`}>
        <header className="text-center mb-5">
          <h1 className={styles.neonTitle}>
            TorqueLab<span className="text-danger"> Projektek</span>
          </h1>
          <p className="text-secondary italic">
            Műhelyünkből kigurult aszfaltszaggatóink kínálata
          </p>
        </header>

        <div className="row justify-content-center g-5">
          {loading ? (
            <div className="text-center text-white">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Motorok melegítése...</p>
            </div>
          ) : cars.length > 0 ? (
            cars.map((car) => {
              // IDE KERÜL A LOGOLÁS
              console.log(`Car ID: ${car.car_id}, Image filename:`, car.image_filename);

              return (
                <div key={car.car_id} className="col-12 col-xl-10">
                  <div className={styles.industrialCard}>
                    <div className="row g-0">
                      <div className="col-md-7">
                        <img
                          src={getImageUrl(car.image_filename)}
                          alt={`${car.brand} ${car.model}`}
                          className={styles.carImg}
                        />
                      </div>
                      <div className="col-md-5 p-4 d-flex flex-column justify-content-center">
                        <div className={styles.buildBadge}>
                          {car.build_type || 'Performance Build'}
                        </div>
                        <h2 className="h1 mb-3">{car.brand} {car.model}</h2>
                        <p className={styles.description}>{car.description}</p>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className={styles.priceTag}>
                            {new Intl.NumberFormat('hu-HU').format(car.price)} Ft
                          </span>

                          <Link href={`/catalog/${car.car_id}`} className={styles.viewBtn}>
                            Specifikációk
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-white py-5">
              <h3 className="text-secondary">Jelenleg minden autónk gazdára talált.</h3>
              <p>Nézz vissza később az újabb projektekért!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}