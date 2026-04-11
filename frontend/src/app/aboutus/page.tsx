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
          <h1 className={styles.glitchText}> Ahol a fém életre kel</h1>
          <p className="lead text-white-50">Két jóbarát valóra vált álma.</p>
        </div>
      </section>

      {/* TÖRTÉNETÜNK SZEKCIÓ */}
      <section className="py-5 container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <h2 className={styles.sectionTitle}>Miért pont a <span className="text-danger">TorqueLab?</span></h2>
            <div className={styles.storyContent}>
                <p className="text-secondary">
                  Számunkra a motorhang nem zaj, a benzingőz pedig nem szag, a gyári teljesítmény pedig nem egy kőbe vésett szabály, csupán egy udvarias ajánlás.
                </p>
                <p>
                  Két barát, egy akna, és több mint 20 év olajsár a körmök alatt - Üdv a TorqueLab-ben.
                </p>
                <p className="text-secondary">
                   Mi nem csak autókat szerelünk. Mi karaktert építünk, határokat feszegetünk, és kihozzuk a vasból azt a potenciált, amit a gyári mérnökök a költségvetési osztály nyomására kénytelenek voltak elrejteni.

                  Hisszük, hogy a tuning nem a hangos kipufogóknál és az utólag rácsavarozott műanyag szárnyaknál kezdődik. A valódi teljesítménynövelés a precizitásról, az átgondolt mérnöki munkáról és a tökéletes harmóniáról szól – legyen szó egy utcai sleeperről, egy pályanapokra épített fenevadról, vagy egy megbízható, de izmosított mindennapos harcosról. 
                </p>
                <p>
                  A fizika törvényeit nem tudjuk átírni, de piszkosul szeretjük meghajlítani őket.
                </p>
            </div>
          </div>
        </div>
        <h2 className={styles.sectionTitle}>Ahonnan indultunk:  <span className="text-danger">A "Nulladik" Kilométerkő</span></h2>
        <p>
          Minden sikeres műhelynek van egy eredettörténete. A miénk nem egy csillogó, szalonállapotú sportkocsival kezdődött, hanem egy viharvert, 1999-es Ford Pumával.
        </p>
        <br />
        <div className={styles.imageCard}>
               <div className={styles.imagePlaceholder}>
                <img src="pics/0b76b99f-ba07-450e-81df-b8b6071e6ba3.jpeg" alt="puma_elso" />
              </div>
            </div>
        <br />
        <p className='text-secondary'>
          A pumának sok baja volt és a motorfelújítástól kezdve a lakataláson át mindent meg kellet rajta csinálni. De mi nem egy leharcolt kupét láttunk benne, hanem a tökéletes kísérleti egeret. 
        </p>
        <p>
          Azokon a fagyos, hajnalba nyúló éjszakákon, a fűtetlen garázsban tanultuk meg a legfontosabb leckéket. Azon a Pumán próbáltuk ki az első saját építésű kipufogórendszerünket, azon kísérleteztünk és kerestük a motorhibát különböző módszerekkel, és azzal az autóval éltük át az első igazán komoly motorépítés izgalmát.
        </p>
        <div className={styles.imageCard}>
               <div className={styles.imagePlaceholder}>szar puma</div>
        </div>
        <p>
          A Puma ma már köszönőviszonyban sincs egykori önmagával. Kapott egy új sport kipufogórendszert, kikönnyítettük az utolsó dekáig, egy teljesen egyedi hajtáslánc van alatta, és jelenleg is aktív, tűzköpő rallyautóként riogatja a mezőnyt a helyi bajnokságokban. Ott áll a műhely sarkában, emlékeztetőül arra, hogy honnan jöttünk, és hogy kellő kitartással és szakértelemmel a legkisebb vasból is lehet aszfaltszaggató szörnyeteget építeni.
        </p>
        <div className={styles.imageCard}>
               <div className={styles.imagePlaceholder}>pimped ai generalt rally puma</div>
        </div>
        <p>
          Van egy elképzelésed? Egy projekted, amihez hiányzik a szakértelem, vagy csak kihoznál még 50 lóerőt a blokkból?
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