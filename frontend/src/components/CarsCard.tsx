import type { CAR } from '@/app/types';
import styles from './CarsCard.module.css';

interface CarCardProps {
  car: CAR;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{car.manufacturer} {car.model}</h3>
      </div>

      <div className={styles.body}>
        <p>
          <strong>Sorozatszám:</strong> {car.serialNumber || '—'}
        </p>
        <p>
          <strong>Utasszám:</strong> {car.passengerCapacity ?? '—'}
        </p>
      
        <p>
          <strong>Státusz:</strong> {car.status || '—'}
        </p>
        <p>
          <strong>Hajtómű:</strong> {car.engineType || '—'}
        </p>
      </div>
    </div>
  );
}