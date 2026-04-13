import styles from './CarDetails.module.css';
import apiRequest from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/api';

// Segédfüggvény az adatok lekéréséhez
async function getCarDetails(id: string) {
  try {
    // Használjuk az apiRequest-et a fetch helyett, ha elérhető
    const data = await apiRequest(`/cars/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });
    return data;
  } catch (error) {
    console.error("Hiba az autó részleteinek lekérésekor:", error);
    return null;
  }
}

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. KÖTELEZŐ: A params objektum feloldása (Next.js 15+ konvenció)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Adatok lekérése a feloldott ID-val
  const car = await getCarDetails(id);

  // 3. Hibakezelés, ha nincs ilyen autó
  if (!car) {
    return (
      <main className={styles.container}>
        <div className="container py-5 text-center">
          <h2 className="text-white">Az autó nem található.</h2>
          <p className="text-secondary">Valószínűleg már elvitték, vagy hibás az URL.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className="container py-5">
        <div className="row g-5">
  
          <div className="col-lg-7">
            <img
              src={getImageUrl(car.image_filename)}
              alt={`${car.brand} ${car.model}`}
              className={styles.mainImage}
            />
          </div>


          <div className="col-lg-5 text-white">
            <span className="text-danger fw-bold text-uppercase">{car.brand}</span>
            <h1 className="display-4 fw-bold">{car.model}</h1>
            <p className="lead text-secondary">{car.description || 'Nincs leírás.'}</p>

            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span>Évjárat:</span> <strong>{car.production_year}</strong>
              </div>
              <div className={styles.specItem}>
                <span>Motor:</span> <strong>{car.engine}</strong>
              </div>
              <div className={styles.specItem}>
                <span>Futásteljesítmény:</span>
                <strong>{car.mileage?.toLocaleString() ?? 0} km</strong>
              </div>
              <div className={styles.specItem}>
                <span>Típus:</span> <strong>{car.build_type || "Egyedi projekt"}</strong>
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-danger fw-bold">
                {car.price ? `${car.price.toLocaleString()} Ft` : "Ár kérésre"}
              </h2>


              <Link
                href="/contact"
                className="btn btn-danger btn-lg w-100 mt-4 fw-bold d-flex align-items-center justify-content-center"
              >
                KAPCSOLATFELVÉTEL
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}