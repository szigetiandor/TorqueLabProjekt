import ProductCard from '@/components/ProductCard';
import CarFilter from '@/components/CarFilter';
import styles from './Catalog.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    <main className={styles.catalogWrapper} style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container py-5">
        
        <section className={styles.headerSection}>
          <h1 className={styles.title}>
            Exkluzív <span className={styles.accent}>Ford Építések</span>
          </h1>
          <p className={styles.subtitle}>
            Egyedi teljesítményű Ford modellek a TorqueLab műhelyéből
          </p>
        </section>

        <CarFilter />

        <div className={`row g-4 ${styles.gridContainer}`}>
          {cars.length > 0 ? (
            cars.map((car: any) => (
              <div key={car.car_id} className="col-md-6 col-lg-4">
                <ProductCard 
                  product={{
                    part_id: car.car_id, // Az id-t ide tesszük, hogy a link jó legyen
                    name: `${car.brand} ${car.model}`,
                    manufacturer: car.build_type.toUpperCase(),
                    part_number: car.vin,
                    price: car.price,
                    stock_quantity: 1, // Hogy ne írja ki: "Nincs készleten"
                    description: car.description,
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