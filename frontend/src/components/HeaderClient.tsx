"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';

export default function HeaderClient({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      setIsOpen(false);
      router.refresh();
    } catch (err) { console.error(err); }
  };

  const closeMenu = () => { 
    setIsOpen(false); 
    setIsDropdownOpen(false); 
  };

  // Külön kezelő a dropdownhoz, hogy megakadályozzuk az esetleges buborékolást
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={styles.headerWrapper}>
      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${styles.navbarCustom}`}>
        <div className="container-fluid">
          
          <Link href="/" className="navbar-brand d-flex align-items-center ms-lg-4" onClick={closeMenu}>
            <div className={styles.logoBox}>TL</div>
            <span className={`ms-2 text-white ${styles.brandText}`}>Torque<span className="text-danger">Lab</span></span>
          </Link>

          <button className="navbar-toggler border-0" type="button" onClick={() => setIsOpen(!isOpen)}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`${styles.menuWrapper} ${isOpen ? styles.open : ''}`}>
            <ul className="navbar-nav mx-auto align-items-lg-center">
              <li className="nav-item px-lg-2">
                <Link className={styles.navLinkCustom} href="/" onClick={closeMenu}>Főoldal</Link>
              </li>
              <li className="nav-item px-lg-2">
                <Link className={styles.navLinkCustom} href="/service" onClick={closeMenu}>Szervíz</Link>
              </li>
              <li className="nav-item px-lg-2">
                <Link className={styles.navLinkCustom} href="/catalog" onClick={closeMenu}>Katalógus</Link>
              </li>

              <li className={`nav-item dropdown px-lg-2 ${styles.dropdownContainer}`}>
                <button 
                  className={styles.navLinkCustom}
                  onClick={toggleDropdown}
                  type="button"
                >
                  <span className="text-danger">Alkatrészek</span>
                  <span className={`ms-1 text-danger transition-all ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ fontSize: '9px' }}>
                    {isDropdownOpen ? '▲' : '▼'}
                  </span>
                </button>
                
                <div className={`${styles.dropdownMenuCustom} ${isDropdownOpen ? styles.show : ''}`}>
                  <div className="container">
                    <div className="row g-4">
                      <div className="col-md-6 border-end border-secondary border-opacity-25">
                        <span className={styles.columnTitle}>SportAlkatrészek</span>
                        <Link className={styles.dropdownItemCustom} href="/performance-parts?category=all" onClick={closeMenu}>
                          <span className="fw-bold">ÖSSZES TERMÉK</span>
                        </Link>
                        <Link className={styles.dropdownItemCustom} href="/performance-parts?category=engine" onClick={closeMenu}>
                          <span className="fw-bold">MOTOR TUNING</span>
                        </Link>
                      </div>
                      <div className="col-md-6 ps-md-5">
                        <span className={styles.columnTitle}>Futómű & Kezelés</span>
                        <Link className={styles.dropdownItemCustom} href="/performance-parts?category=suspension" onClick={closeMenu}>
                          <span className="fw-bold">Felfüggesztés</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item px-lg-2">
                <Link className={styles.navLinkCustom} href="/aboutus" onClick={closeMenu}>Rólunk</Link>
              </li>
            </ul>

            <div className="d-flex flex-column flex-lg-row align-items-center gap-2 me-lg-4 mt-3 mt-lg-0">
              {!user ? (
                <>
                  <Link href="/login" className="btn text-white btn-sm px-3 fw-bold" onClick={closeMenu}>LOGIN</Link>
                  <Link href="/register" className="btn btn-danger btn-sm px-4 rounded-pill fw-bold shadow-sm" onClick={closeMenu}>Regisztráció</Link>
                </>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <span className="text-white small">Üdv, <b>{user.name || user.username}</b></span>
                  <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm px-3 rounded-pill fw-bold">Kijelentkezés</button>
                </div>
              )}
              <Link href="/contact" className="btn btn-outline-danger btn-sm px-4 rounded-pill fw-bold ms-lg-2" onClick={closeMenu}>Kontakt</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}