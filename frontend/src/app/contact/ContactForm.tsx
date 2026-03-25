'use client';
import { useState } from 'react';
import styles from './Contact.module.css';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Itt küldhetnénk az adatokat az Express backendnek
    setSent(true);
  };

  if (sent) {
    return (
      <div className="alert alert-success p-5 text-center">
        <h4 className="text-dark">Köszönjük az üzenetet!</h4>
        <p className="text-dark mb-0">Hamarosan válaszolunk a megadott e-mail címen.</p>
        <button onClick={() => setSent(false)} className="btn btn-outline-dark mt-3">Új üzenet</button>
      </div>
    );
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Neved" required />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Autód típusa (pl. Focus RS Mk3)" />
        </div>
        <div className="col-12">
          <input type="email" className="form-control" placeholder="Email címed" required />
        </div>
        <div className="col-12">
          <textarea className="form-control" rows={5} placeholder="Mesélj nekünk a projektedről..." required></textarea>
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-danger px-5 py-2 fw-bold">ÜZENET KÜLDÉSE</button>
        </div>
      </div>
    </form>
  );
}