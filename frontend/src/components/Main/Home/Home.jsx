import React from 'react';
import './Home.css';

function Home() {

  return (
    <section className="home">

      <article className="welcome">
        <h2>Bienvenid@ al Portal de Aves de Navarrevisca</h2>
          <p>
            Únete a nuestra comunidad de observador@s donde cada avistamiento cuenta. 
            Junt@s documentamos, protegemos y celebramos la biodiversidad de Navarrevisca y de la Sierra de Gredos. 
            Comparte tus observaciones, aprende de otr@s y contribuye a la conservación activa de nuestro patrimonio natural.
          </p>
      </article>

      <article className="locations">

          <h3 className="map-title">Sierra de Gredos</h3>
          <div className="map-container">
            <iframe 
              title="Mapa Sierra de Gredos"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24332.47864775806!2d-5.252577!3d40.250000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3f7d8c6e5a5a5f%3A0x5c5c5c5c5c5c5c5c!2sSierra%20de%20Gredos!5e0!3m2!1ses!2ses!4v1234567890123"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <p className="map-info">
            La Sierra de Gredos es una fortaleza de granito donde las aves se han adaptado 
            a lo extremo. En las cumbres, el acentor alpino y la chova piquirroja dominan 
            los pedregales. En los bosques de pino silvestre, el herrerillo capuchino y 
            el piquituerto encuentran su refugio. Y en los roquedos, el treparriscos escala 
            paredes verticales.
          </p>
          <p className="map-info">
            Es un lugar de contrastes: nieve en invierno, flores en primavera, calor seco 
            en verano y colores ocres en otoño. Cada cambio de estación trae sus propias 
            aves y sus propias historias. Aquí sobreviven especies que en otros sitios 
            ya no se ven, haciendo de Gredos un enclave perfecto para la ornitofauna.
          </p>

          <h3 className="map-title">Navarrevisca</h3>
          <div className="map-container">
            <iframe 
              title="Mapa Navarrevisca"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.123456789012!2d-5.123456!3d40.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3f7d8c6e5a5a5f%3A0x5c5c5c5c5c5c5c5c!2sNavarrevisca!5e0!3m2!1ses!2ses!4v1234567890123"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          <p className="map-info">
            Navarrevisca es un cruce de caminos para las aves en la Sierra de Gredos. 
            Sus riscos graníticos son hogar de buitres, sus bosques de ribera esconden pájaros carpinteros 
            y sus piornales altos son territorio de collalbas y roqueros. Aquí se juntan 
            aves de montaña, de bosque y de río, haciendo de cada paseo un descubrimiento.
          </p>
          <p className="map-info">
            En primavera, los cantos llenan el valle. En verano, las rapaces dominan el cielo. 
            En otoño, bandadas de pájaros migratorios descansan aquí. Y en invierno, 
            los que se quedan muestran cómo sobreviven al frío. Un lugar donde siempre 
            hay algo que ver, escuchar y aprender sobre aves.
          </p>

      </article>

      <article className="content-explore">
        <h3>Explora nuestro contenido</h3>
          <p>
            Accede a nuestra base de datos comunitaria, contribuye con observaciones, 
            participa en foros de identificación, sigue proyectos de conservación activa 
            y descubre cómo tu participación marca la diferencia.
          </p>
      </article>

      <article className="content-explore">

          <h3>Enlaces de interés</h3>
              <div className="link-item">
                  <a href="https://www.navarrevisca.es" target="_blank" rel="noopener noreferrer">
                      Ayuntamiento de Navarrevisca
                  </a>
              </div>
              
              <div className="link-item">
                  <a href="https://www.mancomunidadesavila.es/mancomunidad/alberche/municipios-que-agrupa.html" target="_blank" rel="noopener noreferrer">
                      Mancomunidad Alberche
                  </a>
              </div>
              
              <div className="link-item">
                  <a href="https://patrimonionatural.org/espacios-naturales/parque-regional/parque-regional-sierra-de-gredos" target="_blank" rel="noopener noreferrer">
                      Parque Regional Sierra de Gredos
                  </a>
              </div>
              
              <div className="link-item">
                  <a href="https://seo.org/guia-de-aves/" target="_blank" rel="noopener noreferrer">
                      Guía de Aves SEO Bird Life
                  </a>
              </div>

      </article>

    </section>
  );
}

export default Home;