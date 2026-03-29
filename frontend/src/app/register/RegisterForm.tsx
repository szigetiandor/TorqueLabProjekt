'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Register.module.css';
import { apiRequest } from '@/lib/api'; // Az új fetch-alapú segédünk

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('A két jelszó nem egyezik meg!');
      return;
    }

    setIsLoading(true);

    try {
      // Itt hívjuk meg a saját fetch-alapú apiRequest-ünket
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      // Siker esetén
      window.location.href = '/login?registered=true';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authCard}>
      <div className="text-center mb-4">
        <h2 className={`text-white ${styles.title}`}>Fiók <span className="text-danger">Létrehozása</span></h2>
      </div>

      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-2 small mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="text-secondary small fw-bold mb-1">Felhasználónév</label>
          <input 
            type="text" 
            className={`form-control ${styles.customInput}`}
            required
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>

        <div className="mb-3">
          <label className="text-secondary small fw-bold mb-1">Email cím</label>
          <input 
            type="email" 
            className={`form-control ${styles.customInput}`}
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label className="text-secondary small fw-bold mb-1">Jelszó</label>
            <input 
              type="password" 
              className={`form-control ${styles.customInput}`}
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <label className="text-secondary small fw-bold mb-1">Megerősítés</label>
            <input 
              type="password" 
              className={`form-control ${styles.customInput}`}
              required
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-danger w-100 fw-bold py-2 shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'REGISZTRÁCIÓ'}
        </button>

        <p className="text-center mt-3 text-secondary small">
          Már van fiókod? <Link href="/login" className="text-danger fw-bold text-decoration-none">Belépés</Link>
        </p>
      </form>
    </div>
  );
}