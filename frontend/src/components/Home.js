import React from 'react';

function Home() {
  return (
    <>
      <section className="py-5 text-center">
        <h1 className="display-3 fw-bold">Mide. Comprende. Actúa.</h1>
        <p className="lead mt-3">
          Plataforma de monitoreo ambiental que integra estaciones, datos en tiempo real
          y reportes claros para instituciones y ciudades.
        </p>
        <div className="mt-4">
          <a href="#como-funciona" className="btn btn-success me-2">
            Cómo funciona
          </a>
          <a href="#demo" className="btn btn-outline-secondary">
            Ver demo
          </a>
        </div>
      </section>

      <section id="demo" className="py-5 bg-light">
        <div className="container">
          <h2 className="h4 mb-4 text-center">Nuestros puntos de medición</h2>

          <div className="bg-white rounded shadow-sm p-3">
            <img
              src="/mapaHome.png"
              alt="Mapa de estaciones"
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
