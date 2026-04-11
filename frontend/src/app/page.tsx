import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.mainWrapper}>

      {/* HERO SECTION */}
      <section className={`${styles.heroSection} py-5 position-relative shadow-lg`}>
        <div className="container py-5 text-center">
          <h1 className="display-1 fw-bold text-uppercase italic text-white">
            Torque <span className="text-danger">Lab</span>
          </h1>
          <p className="lead fs-3 mb-5 text-secondary">
            Több mint szervíz. Életstílus.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/aboutus" className={`btn btn-lg px-5 ${styles.btnDangerCustom} text-white`}>
              Ismerd meg csapatunkat!
            </Link>
          </div>
        </div>
      </section>

      {/* RÓLUNK SZAKASZ */}
      <section className="py-5 bg-black">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className={`${styles.darkCard} rounded-4 shadow-sm p-2`}>
                <div 
                  style={{ height: '400px', backgroundColor: '#000' }} 
                  className="rounded-4 d-flex align-items-center justify-content-center text-secondary border border-secondary"
                >
                  [ FOTÓ A MŰHELYÜNKRŐL ]
                </div>
              </div>
            </div>
            <div className="col-lg-6 ps-lg-5 text-white">
              <h2 className="display-5 fw-bold mb-4">Hozd ki a legtöbbet autódból</h2>
              <p className={`${styles.textGray} fs-5 mb-4`}>
                Csapatunk fordokra specializálódott s több mint 20 éves szerelési tapasztalattal rendelkezik.
                Több mint 10 éve pedig utcai és versenyautók építésében, tunningolásában jártas.
              </p>
              <ul className="list-unstyled mb-5">
                <li className="mb-3"><strong className="text-danger">✓</strong> Professzionális diagnosztikai eszközök</li>
                <li className="mb-3"><strong className="text-danger">✓</strong> Minőségi alkatrészek széles választékban</li>
                <li className="mb-3"><strong className="text-danger">✓</strong> Szakértelem a felső fokon</li>
              </ul>
             
              <Link href="/aboutus" className="btn btn-outline-danger px-4 py-2">
                Történetünk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SZOLGÁLTATÁSOK */}
      <section className={`${styles.graySection} py-5`}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6 text-white">Amivel foglalkozunk</h2>
            <div className="bg-danger mx-auto mt-2" style={{ width: '60px', height: '4px' }}></div>
          </div>

          <div className="row g-4">
            {[
              { 
                icon: '🛒', 
                title: 'Minőségi alkatrészek', 
                text: 'Böngéssz prémium alkatrészeink széles kínálatában.', 
                link: '/performance-parts' 
              },
              { 
                icon: '🔧', 
                title: 'Szerviz és Építés', 
                text: 'Teljes körű karbantartás és egyedi projektmunkák.', 
                link: '/service' 
              },
              { 
                icon: '🏎️', 
                title: 'Projekt Autók', 
                text: 'Egyedileg épített járművek, készen az új tulajdonosra.', 
                link: '/catalog' 
              }
            ].map((item, idx) => (
              <div key={idx} className="col-md-4">
                <div className={`${styles.darkCard} text-center p-5 h-100 rounded-4 text-white`}>
                  <div className={`mb-4 fs-1 ${styles.iconGlow}`}>{item.icon}</div>
                  <h4 className="fw-bold mb-3">{item.title}</h4>
                  <p className={`${styles.textGray} mb-4`}>{item.text}</p>
                  <Link href={item.link} className="text-danger fw-bold text-decoration-none">
                    Tudj meg többet →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISZTIKÁK */}
      <section className="py-5 bg-black text-white text-center border-top border-secondary border-opacity-10">
        <div className="container py-4">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h2 className="fw-bold text-danger display-5">500+</h2>
              <p className="text-secondary text-uppercase small ls-2">Befejezett projekt</p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0 border-start border-secondary border-opacity-10">
              <h2 className="fw-bold text-danger display-5">10+</h2>
              <p className="text-secondary text-uppercase small ls-2">Év tapasztalat</p>
            </div>
            <div className="col-md-4 border-start border-secondary border-opacity-10">
              <h2 className="fw-bold text-danger display-5">100%</h2>
              <p className="text-secondary text-uppercase small ls-2">Szenvedély</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}