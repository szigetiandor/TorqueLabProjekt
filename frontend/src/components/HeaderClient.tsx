"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HeaderClient({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { 
        method: 'POST',
        credentials: 'include'
      });
      
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className={styles.headerWrapper}>
      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${styles.navbarCustom}`}>
        <div className="container-fluid">
          
          {/* LOGO */}
          <Link href="/" className={`navbar-brand d-flex align-items-center ms-lg-4 ${styles.navbarBrand}`}>
            <div className={styles.logoBox}>TL</div>
            <span className={`ms-2 text-white ${styles.brandText}`}>
              Torque<span className="text-danger">Lab</span>
            </span>
          </Link>

          {/* Mobil Menü Gomb */}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`navbar-collapse ${isOpen ? 'show' : ''} ${styles.collapseCustom}`}>
            <ul className="navbar-nav mx-auto">
              <li className="nav-item px-2">
                <Link className={`nav-link ${styles.navLinkCustom}`} href="/" onClick={() => setIsOpen(false)}>Főoldal</Link>
              </li>
              <li className="nav-item px-2">
                <Link className={`nav-link ${styles.navLinkCustom}`} href="/service" onClick={() => setIsOpen(false)}>Szervíz</Link>
              </li>
              <li className="nav-item px-2">
                <Link className={`nav-link ${styles.navLinkCustom}`} href="/catalog" onClick={() => setIsOpen(false)}>Katalógus</Link>
              </li>

              {/* PARTS DROPDOWN */}
              <li className={`nav-item dropdown px-2 ${styles.dropdownContainer}`}>
                <Link 
                  className={`nav-link dropdown-toggle ${styles.navLinkCustom} ${styles.dropdownToggle} text-danger`} 
                  href="/performance-parts" 
                  id="navbarDropdown"
                  role="button"
                  aria-expanded="false"
                > 
                  Alkatrészek 
                </Link> 

                <ul className={`dropdown-menu ${styles.dropdownMenuCustom}`} aria-labelledby="navbarDropdown"> 
                  <div className="container"> 
                    <div className="row g-4"> 
                      <div className="col-md-6 border-end border-secondary border-opacity-25"> 
                        <span className={styles.columnTitle}>SportAlkatrészek</span> 
                        <Link className={styles.dropdownItemCustom} href="/performance-parts?category=all" onClick={() => setIsOpen(false)}> 
                          <span className="fw-bold">ÖSSZES</span> 
                          <span className={styles.itemSubtitle}>Magas minőség</span> 
                        </Link> 
                        <Link className={styles.dropdownItemCustom} href="/performance-parts?category=engine" onClick={() => setIsOpen(false)}> 
                          <span className="fw-bold">MOTOR TUNING</span> 
                          <span className={styles.itemSubtitle}>Turbók, Sportalkatrészek</span> 
                        </Link> 
                      </div> 

                      <div className="col-md-6 ps-md-5"> 
                        <span className={styles.columnTitle}>Kezelés</span> 
                        <Link className={styles.dropdownItemCustom} href="/performance-parts?category=suspension" onClick={() => setIsOpen(false)}> 
                          <span className="fw-bold">Felfüggesztés</span> 
                          <span className={styles.itemSubtitle}>Futómű</span> 
                        </Link> 
                        {user && (
                          <Link className={`${styles.dropdownItemCustom} text-danger`} href="/catalog" onClick={() => setIsOpen(false)}> 
                            <span className="fw-bold text-uppercase">Ford Projekt autók</span> 
                            <span className={styles.itemSubtitle}>Projektek</span> 
                          </Link>
                        )} 
                      </div> 
                    </div> 
                  </div> 
                </ul> 
              </li>

              <li className="nav-item px-2">
                <Link className={`nav-link ${styles.navLinkCustom}`} href="/aboutus" onClick={() => setIsOpen(false)}>Rólunk</Link>
              </li>

              {/* ADMIN */}
              {user?.is_admin && (
                <li className="nav-item px-2">
                  <Link className={`nav-link text-danger fw-bold ${styles.navLinkCustom}`} href="/admin/dashboard" onClick={() => setIsOpen(false)}>ADMIN</Link>
                </li>
              )}
            </ul>

            {/*  be van e jelentkezve vagy sem (még nem kész) */}
            <div className="d-flex flex-column flex-lg-row align-items-center gap-2 me-lg-4 mt-3 mt-lg-0">
              {!user ? (
                <>
                  <Link href="/login" className="btn text-white btn-sm px-3 fw-bold" onClick={() => setIsOpen(false)}>LOGIN</Link>
                  <Link href="/register" className="btn btn-danger btn-sm px-4 rounded-pill fw-bold shadow-sm" onClick={() => setIsOpen(false)}>Regisztráció</Link>
                </>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <span className="text-secondary small d-none d-xl-inline">
                    Üdv, <b className="text-white">{user.name || user.username}</b>
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm px-3 rounded-pill fw-bold">Kijelentkezés</button>
                </div>
              )}
              <Link href="/contact" className="btn btn-outline-danger btn-sm px-4 rounded-pill fw-bold ms-lg-2">Kontakt</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}