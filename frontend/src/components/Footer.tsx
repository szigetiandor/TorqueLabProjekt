import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row text-center">

          {/* Kapcsolat */}
          <div className="col-md-4 mb-5 mb-md-0">
            <h3 className={styles.footerTitle}>Kapcsolat</h3>
            <ul className={styles.footerList}>
              <li className={styles.footerListItem}>Telefon: +36 30 798 8819</li>
              <li className={styles.footerListItem}>Email: torque.lab@gmail.com</li>
              <li className={styles.footerListItem}>Discord: Csatlakozz hozzánk</li>
            </ul>
          </div>

          {/*Jogi nyilatkozatok*/}
          <div className="col-md-4 mb-5 mb-md-0">
            <h3 className={styles.footerTitle}>Feltételek</h3>
            <ul className={styles.footerList}>
              <li className={styles.footerListItem}>
                <Link href="/terms" className={styles.footerLink}>Általános Szerződési Feltételek</Link>
              </li>
              <li className={styles.footerListItem}>
                <Link href="/privacy" className={styles.footerLink}>Adatvédelmi Nyilatkozat</Link>
              </li>
              <li className={styles.footerListItem}>
                <Link href="/cookies" className={styles.footerLink}>Süti Beállítások</Link>
              </li>
            </ul>
          </div>

          {/*Egyéb*/}
          <div className="col-md-4">
            <h3 className={styles.footerTitle}>További infók</h3>
            <ul className={styles.footerList}>
              <li className={styles.footerListItem}>
                <Link href="/shipping" className={styles.footerLink}>Szállítási információk</Link>
              </li>
              <li className={styles.footerListItem}>
                <Link href="/payment" className={styles.footerLink}>Fizetési módok</Link>
              </li>
              <li className={styles.footerListItem}>
                <Link href="/refund" className={styles.footerLink}>Visszatérítési szabályzat</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* legalja*/}
        <div className="row mt-5">
          <div className="col-12">
            <hr className={styles.vonal} />
            <div className="text-center py-3">
              <p className={styles.copyrightText}>
                © 2026 TORQUELAB – TUNING MASTER PERFORMANCE
              </p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}