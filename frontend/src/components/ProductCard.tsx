import Link from 'next/link';
import styles from './ProductCard.module.css';

// 1. Átalakítjuk az interfészt, hogy illeszkedjen a valósághoz
export interface Product {
  id?: string | number;
  isCar?: boolean;
  title?: string;       
  category?: string;
  price?: string;       
  specs?: string;      
  inStock?: boolean;   
  image?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  if (!product) return null;

  return (
    <div className={styles.card}>
      {/* Készlet jelző */}
      {product.inStock !== undefined && (
        <div className={`${styles.stockBadge} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      )}

      <div className={styles.imageContainer}>
        {product.image ? (
            <div 
                className={styles.actualImage} 
                style={{ backgroundImage: `url(${product.image})` }} 
            />
        ) : (
            <div className={styles.placeholderImg}>
                <span className="text-uppercase opacity-25 fw-bold">nincs kép</span>
            </div>
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.categoryTag}>{product.category}</span>
        <h3 className={styles.productName}>{product.title}</h3>
        
        {/* Specifikációk megjelenítése*/}
        <div className={styles.compat}>
          {product.specs && (
            <span className="badge bg-dark text-secondary p-2">
              {product.specs.toUpperCase()}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.priceTag}>
            {product.price}
          </div>

          <Link 
            href={`/catalog/${product.id}`} 
            className={`${styles.addBtn} text-decoration-none text-center`}
          >
             Részletek
          </Link>
        </div>
      </div>
    </div>
  );
}