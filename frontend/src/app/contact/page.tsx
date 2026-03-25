import ContactForm from './ContactForm';
import styles from './Contact.module.css';

export const metadata = {
  title: 'Kapcsolat | TorqueLab',
  description: 'Kérdésed van a Fordodról? Lépj velünk kapcsolatba!',
};

export default function ContactPage() {
  return (
    <main className={styles.contactMain}>
      <div className="container">
        <h1 className={styles.title}>Lépj velünk <span className="text-danger">Kapcsolatba</span></h1>
        <p className="text-secondary mb-5">Kérdésed van az autóddal kapcsolatban? Készen állsz a teljesítmény növelésére? Beszéljünk!</p>
        
        <div className="row g-5">
          {/* Elérhetőségek*/}
          <div className="col-lg-5">
            <div className={styles.infoBox}>
              <h3>Kapcsolati adatok</h3>
              <p><span>Telefon:</span> +36 30 798 8819</p>
              <p><span>Email:</span> torque.lab@gmail.com</p>
              <p><span>Helyszín:</span> Budapest, Magyarország (Központ)</p>
              
              <div className={styles.socials}>
                <h4>Csatlakozz a közösséghez</h4>
                <p>Discord / Instagram / Facebook</p>
              </div>
            </div>
          </div>

          
          <div className="col-lg-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}