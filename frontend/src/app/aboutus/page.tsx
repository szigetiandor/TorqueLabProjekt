import styles from './Aboutus.module.css';

// A tanár által kért metaadatok a keresőoptimalizáláshoz
export const metadata = {
  title: 'Rólunk | TorqueLab',
  description: 'Ismerd meg a TorqueLab történetét és a Ford tuning iránti szenvedélyünket.',
};

export default function AboutPage() {
  return (
    <main className={styles.aboutMain}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.glitchText}>A TELJESÍTMÉNY ÉLTET</h1>
          <p className="lead text-white-50">A Ford-rajongók és a tuning megszállottjainak találkozóhelye.</p>
        </div>
      </section>

      {/* TÖRTÉNETÜNK SZEKCIÓ */}
      <section className="py-5 container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <h2 className={styles.sectionTitle}>Utunk <span className="text-danger">Története</span></h2>
            <div className={styles.storyContent}>
                <p className="text-secondary">
                  A TorqueLab több mint egy egyszerű műhely – ez egy közösség. 2020-ban 
                  azzal az egyetlen céllal alapítottuk, hogy a Ford tulajdonosok számára 
                  kompromisszummentes teljesítménynövelő megoldásokat és professzionális 
                  szakértelmet biztosítsunk.
                </p>
                <p className="text-secondary">
                  Mára az iparág vezető gyártóival dolgozunk együtt. Egyedi kalibrációinkkal 
                  és csúcskategóriás alkatrészeinkkel a maximumot hozzuk ki a Focus RS, ST 
                  és Mustang modellekből.
                </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className={styles.imageCard}>
               <div className={styles.imagePlaceholder}>MÉRNÖKI PRECÍZITÁS</div>
            </div>
          </div>
        </div>
      </section>

      {/* ÉRTÉKEINK SZEKCIÓ */}
      <section className="bg-dark py-5">
        <div className="container">
          <div className="row text-center">
            {[
              { id: '01', title: 'Szakértelem', desc: 'Több mint egy évtizedes tapasztalat a Ford EcoBoost és Coyote motorplatformok terén.' },
              { id: '02', title: 'Minőség', desc: 'Kizárólag bizonyított prémium márkákkal dolgozunk, mint a Mountune, Milltek vagy az Airtec.' },
              { id: '03', title: 'Szenvedély', desc: 'Minden autót úgy építünk, mintha a sajátunk lenne. Kompromisszumok nélkül, csak a tiszta teljesítmény.' }
            ].map((value) => (
              <div key={value.id} className="col-md-4">
                <div className={styles.valueCard}>
                  <div className="text-danger mb-3 h1">{value.id}</div>
                  <h5>{value.title}</h5>
                  <p className="small text-secondary">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}