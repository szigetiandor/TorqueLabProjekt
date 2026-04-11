'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import styles from './PerformanceParts.module.css';

export default function PerformancePartsPage() {
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Paraméterek figyelése
  const carFilter = searchParams.get('car') || '';
  const priceFilter = searchParams.get('price') || '1500000';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // A 'car' paramétert küldjük el 'query' néven a backendnek
        const response = await fetch(
          `${API_URL}/parts?query=${carFilter}&price=${priceFilter}`
        );

        if (!response.ok) throw new Error('Hiba a lekérésnél');

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Hiba:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [carFilter, priceFilter, API_URL]);

  return (
    <main className={styles.mainWrapper} style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container-fluid px-lg-5">
        <div className="row">
          <div className="col-lg-3"><Sidebar /></div>
          <div className="col-lg-9">
            <h1 className="text-white fw-bold mb-4">
              <span className="text-danger">Sport</span> Alkatrészek
              <small className="text-secondary fs-6 ms-3">({products.length} db)</small>
            </h1>

            {loading ? (
              <div className="text-center py-5 text-danger"><div className="spinner-border"></div></div>
            ) : (
              <div className="row g-4">
                {products.length > 0 ? (
                  products.map((p: any) => (
                    <div key={p.part_id} className="col-md-6 col-xl-4"><ProductCard product={p} /></div>
                  ))
                ) : (
                  <p className="text-secondary text-center py-5">Nincs találat.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}