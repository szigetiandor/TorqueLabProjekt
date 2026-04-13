import Link from 'next/link';
import styles from './ProductCard.module.css';
import { getImageUrl } from '@/lib/api';

// Az SQL tábládhoz igazított interface
export interface Product {
  part_id: number;
  name: string;
  manufacturer: string;
  part_number: string;
  price: number;
  stock_quantity: number;
  description: string;
  image_filename: string; // Ha később lesz kép az adatbázisban
}

export default function ProductCard({ product }: { product: Product }) {
  if (!product) return null;

  const inStock = product.stock_quantity > 0;

  console.log(product)

  const productImageUrl = getImageUrl(product.image_filename);

  return (
    <div className={styles.card}>
      {/* Készlet jelző */}
      <div className={`${styles.stockBadge} ${inStock ? styles.inStock : styles.outOfStock}`}>
        {inStock ? `${product.stock_quantity} db készleten` : 'Nincs készleten'}
      </div>

      <div className={styles.imageContainer}>
        {/* Mivel a getImageUrl már alapból ad vissza valamit, 
            itt eldöntheted, hogy mindig megmutatod-e a képet */} 
        <div 
          className={styles.actualImage} 
          style={{ backgroundImage: `url(${productImageUrl})` }} 
        />
      </div>

      <div className={styles.content}>
        <span className={styles.categoryTag}>{product.manufacturer}</span>
        <h3 className={styles.productName}>{product.name}</h3>
        
        <div className={styles.compat}>
          <span className="badge bg-dark text-secondary p-2">
            {product.part_number}
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceTag}>
            {Number(product.price).toLocaleString('hu-HU')} <small className={styles.currency}>Ft</small>
          </div>
{/*
          <Link 
            href={`/catalog/${product.part_id}`} 
            className={`${styles.addBtn} text-decoration-none text-center`}
          >
             Részletek
          </Link>
*/}
        </div>
      </div>
    </div>
  );
}