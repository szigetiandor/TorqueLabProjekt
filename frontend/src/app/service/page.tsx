import ServiceForm from './ServiceForm';
import styles from './Service.module.css';

export const metadata = {
  title: 'Szerviz Időpontfoglalás | TorqueLab',
  description: 'Foglalj időpontot professzionális Ford szervizre, diagnosztikára vagy teljesítménynövelésre.',
};

export default function ServicePage() {
  return (
    <main className={styles.serviceMain}>
      <section className="py-5 bg-dark">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>Szerviz <span className="text-danger">Időpontfoglalás</span></h2>
                <p className="text-secondary mb-4">
                  Töltse ki az alábbi űrlapot a szervizigény leadásához. Ismeretlen hibák esetén kérjük vegye figyelembe, hogy 
                  <span className="text-white fw-bold"> kötelező diagnosztikai díjat és időt</span> számolunk fel.
                </p>
                <ServiceForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}