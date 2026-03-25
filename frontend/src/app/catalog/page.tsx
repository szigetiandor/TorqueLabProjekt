import ProductCard from '@/components/ProductCard';
import CarFilter from '@/components/CarFilter';
import styles from './Catalog.module.css';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCars() {
  try {
    const res = await fetch(`${API_URL}/cars`, { 
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

  return (
    <main className={styles.catalogWrapper}>
      <div className="container py-5">
        
        {/* Fejléc*/}
        <section className={styles.headerSection}>
          <h1 className={styles.title}>
            Exkluzív <span className={styles.accent}>Ford Építések</span>
          </h1>
          <p className={styles.subtitle}>
            Egyedi teljesítményű Ford modellek a TorqueLab műhelyéből
          </p>
        </section>

        <CarFilter />

        {/* Autó Lista */}
        <div className={`row g-4 ${styles.gridContainer}`}>
          {cars.length > 0 ? (
            cars.map((car: any) => (
              <div key={car.vin} className="col-md-6 col-lg-4">
                <ProductCard 
                    product={{
                      id: car.vin,
                      isCar: true, 
                      title: `${car.brand} ${car.model}`,
                      category: car.production_year.toString(),
                      specs: `${car.engine} | ${car.mileage.toLocaleString()} km`,
                      price: car.price ? `${car.price.toLocaleString()} €` : "Ár kérésre",
                      image: car.imageUrl || '/images/placeholder-car.jpg'
                    }}
                  />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Nem található autó</h3>
              <p className="text-secondary">A bemutatóterem jelenleg üres.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}