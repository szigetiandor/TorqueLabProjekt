import styles from './Aboutus.module.css';

export const metadata = {
  title: 'Rólunk | TorqueLab',
  description: 'Ismerd meg a TorqueLab történetét és a Ford tuning iránti szenvedélyünket.',
};

export default function AboutPage() {
  return (
    <main className={styles.aboutMain}>
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.glitchText}>Ahol a fém életre kel</h1>
          <p className="lead text-white-50">Két jóbarát valóra vált álma.</p>
        </div>
      </section>

      {/* miert a torque lab szekcio*/}
      <section className="py-5 container">
        <h2 className={styles.sectionTitle}>
          Miért pont a <span className="text-danger">TorqueLab?</span>
        </h2>
        <div className={styles.storyContent}>
          <p className="text-secondary">
            Számunkra a motorhang nem zaj, a benzingőz pedig nem szag, a gyári teljesítmény
            pedig nem egy kőbe vésett szabály, csupán egy udvarias ajánlás.
          </p>
          <p>
            Két barát, egy akna, és több mint 20 év olajsár a körmök alatt – Üdv a TorqueLab-ben.
          </p>
          <p className="text-secondary">
            Mi nem csak autókat szerelünk. Mi karaktert építünk, határokat feszegetünk, és
            kihozzuk a vasból azt a potenciált, amit a gyári mérnökök a költségvetési osztály
            nyomására kénytelenek voltak elrejteni. Hisszük, hogy a tuning nem a hangos
            kipufogóknál és az utólag rácsavarozott műanyag szárnyaknál kezdődik. A valódi
            teljesítménynövelés a precizitásról, az átgondolt mérnöki munkáról és a tökéletes
            harmóniáról szól – legyen szó egy utcai sleeperről, egy pályanapokra épített
            fenevadról, vagy egy megbízható, de izmosított mindennapos harcosról.
          </p>
          <p>
            A fizika törvényeit nem tudjuk átírni, de piszkosul szeretjük meghajlítani őket.
          </p>
        </div>
      </section>

      {/* csapatunk */}
      <section className="py-5 container">
        <h2 className={`${styles.sectionTitle} mb-5`}>
          Csapatunk <span className="text-danger">tagjai</span>
        </h2>

        {/* ANDOR KÁRTYA */}
        <div
          className="mb-4 rounded-4 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div className="row g-0" style={{ minHeight: '340px' }}>
            <div className="col-md-7 d-flex">
              <div className="row g-0 w-100">
                <div className="col-6">
                  <img
                    src="andor_szemuveg.jpeg"
                    alt="Andor szemüvegben"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div className="col-6">
                  <img
                    src="andor_kipufogo.jpeg"
                    alt="Andor kipufogónál"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>

            {/* Szöveg-andor */}
            <div className="col-md-5 d-flex flex-column justify-content-center p-4 p-md-5">
              <div
                className="text-danger fw-bold mb-1"
                style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
              >
                Csapattag
              </div>
              <h3 className="mb-1 fw-bold text-white" style={{ fontSize: '2rem' }}>
                Andor
              </h3>
              <div
                className="mb-3"
                style={{ width: '40px', height: '3px', background: '#dc3545', borderRadius: '2px' }}
              />
              <p className="text-secondary mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                Az ezermester. Andor az, akihez akkor fordulsz, amikor már mindenki más feladta.
                Hegeszt, épít, javít és újragondol – számára nincs lehetetlen. A műhelyben szerzett
                több éves tapasztalata és precizitása teszi őt a csapat egyik alappillérévé.
              </p>
            </div>
          </div>
        </div>

        {/* ZSÓFI KÁRTYA */}
        <div
          className="rounded-4 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div className="row g-0" style={{ minHeight: '340px' }}>
            {/* Szöveg-zsófi */}
            <div className="col-md-5 d-flex flex-column justify-content-center p-4 p-md-5 order-md-1">
              <div
                className="text-danger fw-bold mb-1"
                style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
              >
                Csapattag
              </div>
              <h3 className="mb-1 fw-bold text-white" style={{ fontSize: '2rem' }}>
                Zsófi
              </h3>
              <div
                className="mb-3"
                style={{ width: '40px', height: '3px', background: '#dc3545', borderRadius: '2px' }}
              />
              <p className="text-secondary mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                A precíz szem. Zsófi az, aki a részletekben látja meg a különbséget. Ő felel azért,
                hogy minden projekt nem csak működjön, hanem tökéletesen is nézzen ki.
                Pontosság, rendszer és minőség – ez az ő világa.
              </p>
            </div>

            <div className="col-md-7 d-flex order-md-2">
              <div className="row g-0 w-100">
                <div className="col-6">
                  <img
                    src="zsofi_dugattyu.jpeg"
                    alt="Zsófi az aknában"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div className="col-6">
                  <img
                    src="zsofi_puma_alatt.jpeg"
                    alt="Zsófi a Puma alatt"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* NULLADIK KILOMÉTERKŐ */}
    <section className="py-5 container">
      <h2 className={styles.sectionTitle}>
        Ahonnan indultunk: <span className="text-danger">A „Nulladik" Kilométerkő</span>
      </h2>
      
      <p className="mb-4">
        Minden sikeres műhelynek van egy eredettörténete. A miénk nem egy csillogó,
        szalonállapotú sportkocsival kezdődött, hanem egy viharvert, 1999-es Ford Pumával.
      </p>

      {/* kep -- video egymas mellett */}
      <div className="row g-4 mb-4"> 
        {/* kep */}
        <div className="col-md-6">
          <div className={styles.imageCard} style={{ height: '400px' }}>
            <div className={styles.imagePlaceholder} style={{ height: '100%', width: '100%' }}>
              <img 
                src="/puma_elso.png" 
                alt="puma_elso" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>

        {/* video */}
        <div className="col-md-6">
          <div className={styles.imageCard} style={{ height: '400px' }}>
            <div className={styles.imagePlaceholder} style={{ height: '100%', width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
              <video
                src="/puma_fustol.mp4" 
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>

        <br />
        <p className="text-secondary">
          A pumának sok baja volt és a motorfelújítástól kezdve a lakataláson át mindent meg kellett
          rajta csinálni. De mi nem egy leharcolt kupét láttunk benne, hanem a tökéletes kísérleti
          egeret.
        </p>
        <p>
          Mi a garázsban tanultunk meg szerelni. Azon a Pumán próbáltuk ki az első saját építésű
          kipufogórendszerünket, azon kísérleteztünk és kerestük a motorhibát különböző
          módszerekkel, és azzal az autóval éltük át az első igazán komoly motorépítés izgalmát.
        </p>
        
             {/* 3 kep */}
      <div className="row g-4 mb-4"> 
        {/* kep */}
        <div className="col-md-4">
          <div className={styles.imageCard} style={{ height: '400px' }}>
            <div className={styles.imagePlaceholder} style={{ height: '100%', width: '100%' }}>
              <img 
                src="/puma_szereles2.jpeg" 
                alt="puma szerelése" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className={styles.imageCard} style={{ height: '400px' }}>
            <div className={styles.imagePlaceholder} style={{ height: '100%', width: '100%' }}>
              <img 
                src="/puma_szereles3.jpeg" 
                alt="puma szerelése" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={styles.imageCard} style={{ height: '400px' }}>
            <div className={styles.imagePlaceholder} style={{ height: '100%', width: '100%' }}>
              <img 
                src="/puma_szereles1.png"
                alt="puma szerelése" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      </div>
          
        <div className="row g-5 align-items-center mb-5"> 
        {/* SZÖVEG OSZLOP */}
        <div className="col-md-6">
          <p className="lead text-white">
            A Puma ma már köszönőviszonyban sincs egykori önmagával. 
            Kapott egy új sport kipufogórendszert, kikönnyítettük az utolsó dekáig, 
            egy teljesen egyedi hajtáslánc van alatta, és jelenleg is aktív, 
            tűzköpő autóként riogatja az utakat.
          </p>
          <p className="text-secondary">
            Minden egyes csavarját ismerjük, és ez az autó a bizonyíték rá: 
            nincs reménytelen projekt, csak kevés elszántság.
          </p>
        </div>

        {/* MAGASABB KÉP OSZLOP */}
        <div className="col-md-6">
          <div className={styles.imageCard} style={{ height: '600px' }}> {/* Itt emeltük meg a magasságot */}
            <div className={styles.imagePlaceholder} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
              <img 
                src="/puma_pimped.jpeg" 
                alt="pimped rally puma" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', // Kitölti a 600px-t, de nem torzul
                  objectPosition: 'center', // Középre fókuszál a kép vágásánál
                  borderRadius: '8px' 
                }}
              />
            </div>
          </div>
        </div>
      </div>
        
        <p>
          Van egy elképzelésed? Egy projekted, amihez hiányzik a szakértelem, vagy csak kihoznál
          még 50 lóerőt a blokkból?
        </p>
        <p>
          Gurulj be hozzánk, igyál meg egy kávét, és mi kihozzuk autódból a legjobbat!
        </p>
      </section>

      {/* ÉRTÉKEINK SZEKCIÓ */}
      <section className="bg-dark py-5">
        <div className="container">
          <div className="row text-center">
            {[
              {
                id: '01',
                title: 'Szakértelem',
                desc: 'Több mint egy évtizedes tapasztalat a Ford EcoBoost és Coyote motorplatformok terén.',
              },
              {
                id: '02',
                title: 'Minőség',
                desc: 'Kizárólag bizonyított prémium márkákkal dolgozunk, mint a Mountune, Milltek vagy az Airtec.',
              },
              {
                id: '03',
                title: 'Szenvedély',
                desc: 'Minden autót úgy építünk, mintha a sajátunk lenne. Kompromisszumok nélkül, csak a tiszta teljesítmény.',
              },
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