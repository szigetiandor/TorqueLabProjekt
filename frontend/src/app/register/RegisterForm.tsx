'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Register.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Alapvető validáció kliens oldalon
    if (formData.password !== formData.confirmPassword) {
      setError('A két jelszó nem egyezik meg!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.username, // A backend 'name' mezőt vár az SQL alapján
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Hiba történt a regisztráció során!');
      }

      // Siker esetén átirányítjuk a loginra
      window.location.href = '/login?registered=true';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <div className="text-center">
        <h2 className={`text-white ${styles.title}`}>Fiók <span className="text-danger">Létrehozása</span></h2>
        <span className={styles.subtitle}>Csatlakozz a TorqueLab versenyzői közösségéhez</span>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <small>{error}</small>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Felhasználónév</label>
          <input 
            type="text" 
            className={`form-control ${styles.customInput}`}
            placeholder="Példa: RaceMaster99"
            required
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Email cím</label>
          <input 
            type="email" 
            className={`form-control ${styles.customInput}`}
            placeholder="sofor@torquelab.hu"
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className={styles.inputGroup}>
              <label>Jelszó</label>
              <input 
                type="password" 
                className={`form-control ${styles.customInput}`}
                placeholder="••••••••"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className={styles.inputGroup}>
              <label>Megerősítés</label>
              <input 
                type="password" 
                className={`form-control ${styles.customInput}`}
                placeholder="••••••••"
                required
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn btn-danger w-100 ${styles.submitBtn}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status"></span>
          ) : 'Regisztráció'}
        </button>

        <p className={styles.footerText}>
          Már van fiókod? {' '}
          <Link href="/login" className={styles.link}>Jelentkezz be</Link>
        </p>
      </form>
    </div>
  );
}