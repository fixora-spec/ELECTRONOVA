import React from 'react';
import SeccionHero from '../organisms/SeccionHero';
import TarjetaProducto from '../molecules/TarjetaProducto';
import './PaginaInicio.css';

const productosMock = [
  { id: 1, titulo: 'Foco LED 9W', precio: 12.90, imagen: '', estado: 'En stock' },
  { id: 2, titulo: 'Cable THHN 12 AWG', precio: 2.50, imagen: '', estado: 'En stock' },
  { id: 3, titulo: 'Interruptor Simple', precio: 8.90, imagen: '', estado: 'En stock' },
  { id: 4, titulo: 'Tomacorriente Doble', precio: 15.90, imagen: '', estado: 'En stock' },
  { id: 5, titulo: 'Breaker 20A', precio: 25.90, imagen: '', estado: 'En stock' },
];

const PaginaInicio = () => {
  return (
    <div className="pagina-inicio">
      <main>
        <SeccionHero />
        
        <section className="seccion-destacados">
          <div className="seccion-cabecera">
            <h2>Productos destacados</h2>
            <a href="/productos" className="enlace-ver-todos">Ver todos los productos →</a>
          </div>
          
          <div className="cuadricula-productos">
            {productosMock.map(prod => (
              <TarjetaProducto 
                key={prod.id}
                titulo={prod.titulo}
                precio={prod.precio}
                imagen={prod.imagen}
                estado={prod.estado}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
export default PaginaInicio;