// app/catalog/[id]/page.tsx
import styles from './CarDetails.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCarDetails(id: string) {
  const res = await fetch(`${API_URL}/cars/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const car = await getCarDetails(params.id);

  if (!car) return <div className="text-white text-center py-5">Az autó nem található.</div>;

  return (
    <main className={styles.container}>
      <div className="container py-5">
        <div className="row g-5">
          {/* Bal oldal: Kép */}
          <div className="col-lg-7">
            <img 
              src={car.imageUrl || '/images/placeholder-car.jpg'} 
              alt={`${car.brand} ${car.model}`} 
              className={styles.mainImage} 
            />
          </div>

          {/* Jobb oldal: Adatok */}
          <div className="col-lg-5 text-white">
            <span className="text-danger fw-bold text-uppercase">{car.brand}</span>
            <h1 className="display-4 fw-bold">{car.model}</h1>
            <p className="lead text-secondary">{car.description || 'Nincs leírás.'}</p>
            
            <div className={styles.specsGrid}>
              <div className={styles.specItem}><span>Évjárat:</span> <strong>{car.production_year}</strong></div>
              <div className={styles.specItem}><span>Motor:</span> <strong>{car.engine}</strong></div>
              <div className={styles.specItem}><span>Futásteljesítmény:</span> <strong>{car.mileage.toLocaleString()} km</strong></div>
              <div className={styles.specItem}><span>Típus:</span> <strong>{car.build_type}</strong></div>
            </div>

            <div className="mt-5">
              <h2 className="text-danger fw-bold">
                {car.price ? `${car.price.toLocaleString()} Ft` : "Ár kérésre"}
              </h2>
              <button className="btn btn-danger btn-lg w-100 mt-4 fw-bold">KAPCSOLATFELVÉTEL</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}