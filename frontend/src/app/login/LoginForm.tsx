'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Login.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Hibás e-mail vagy jelszó!');
      }

      // redirect
      window.location.href = '/catalog';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };









  return (
    <div className={styles.authCard}>
      <h2 className={`text-center text-white ${styles.title}`}>
        LOGIN TO <span className="text-danger">TORQUELAB</span>
      </h2>

      {error && (
        <div className={`alert alert-danger ${styles.errorAlert} d-flex align-items-center`} role="alert">
          <span className="me-2">⚠️</span>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input 
            type="email" 
            className={`form-control ${styles.customInput}`}
            placeholder="name@racing.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input 
            type="password" 
            className={`form-control ${styles.customInput}`}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={`btn btn-danger w-100 ${styles.submitBtn}`} disabled={isLoading}>
          {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Sign In'}
        </button>

        <p className={styles.switchText}>
          Don't have an account? {' '}
          <Link href="/register" className={styles.link}>Register</Link>
        </p>
      </form>
    </div>
  );
}