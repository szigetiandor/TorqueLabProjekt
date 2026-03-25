'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProductCard from '@/components/ProductCard';
import styles from './PerformanceParts.module.css';

export default function PerformancePartsPage() {
  const searchParams = useSearchParams();
  
  // Paraméterek kinyerése az URL-ből
  const categoryFilter = searchParams.get('category') || 'all';
  const carFilter = searchParams.get('car') || '';
  const priceFilter = searchParams.get('price') || '1500000';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        //  szurok a backendnek még hardcode
        const response = await fetch(
          `http://localhost:5000/api/parts?category=${categoryFilter}&car=${carFilter}&price=${priceFilter}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    //priceFilter
  }, [categoryFilter, carFilter, priceFilter]);

  return (
    <main className={styles.mainWrapper}>
      <div className="container-fluid px-lg-5">
        <div className="row">
          <div className="col-lg-3 mb-5">
            <Sidebar defaultCategory={categoryFilter} />
          </div>

          <div className="col-lg-9">
            <div className={styles.headerBox}>
              <h1 className={styles.pageTitle}>
                 <span className="text-danger">Sport</span>Alkatrészek
              </h1>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="mt-3 text-secondary">betöltés...</p>
              </div>
            ) : (
              <div className="row g-4">
                {products.length > 0 ? (
                  products.map((product: any) => (
                    <div key={product.ProductID} className="col-md-6 col-xl-4">
                      <ProductCard product={{
                        id: product.ProductID,
                        //name: product.PartName,
                        category: product.Category,
                        price: product.Price,
                        //cars: [carFilter || "Various Models"], 
                        inStock: product.StockQuantity > 0
                      }} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="text-secondary fs-5">Nincs ilyen alkatrész az adatbázisban a megadott szűrőkkel.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}