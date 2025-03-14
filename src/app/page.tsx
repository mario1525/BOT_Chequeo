"use client";

import { useEffect } from "react";
import "./globals.css"; // Importa los estilos globales

export default function Home() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.innerHTML = `window.$zoho=window.$zoho || {}; $zoho.salesiq=$zoho.salesiq||{ready:function(){}}`;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src =
      "https://salesiq.zohopublic.com/widget?wc=siq1b223a368a90eddef5e58636e729637f93f8d110f63a867871603095ebe2e15c";
    script2.defer = true;
    document.body.appendChild(script2);
  }, []);

  return (
    <div>
      <header>
        <nav className="navbar">
          <div className="logo">SGS</div>
          <ul className="nav-links">
            <li><a href="#">Nuestros Servicios</a></li>
            <li><a href="#">Acerca de SGS</a></li>
            <li><a href="#">Relaciones con los inversores</a></li>
            <li><a href="#">Sostenibilidad Corporativa</a></li>
            <li><a href="#">Noticias y recursos</a></li>
          </ul>
          <div className="nav-actions">
            <input type="text" placeholder="Buscar..." />
            <button className="contact-btn">Contactar</button>
          </div>
        </nav>
      </header>

      <section className="hero"> 
        <div className="hero-content"> 
          <h1>Natural Resouces - Minerales</h1> 
          <p>Minimice riesgos y tome decisiones informadas en el sector de minerales.</p> 
          <p>Conozca el estado de sus servicios en tiempo real y manténgase al tanto de posibles retrasos en los analisis de sus muestas.</p> 
        </div> 
      </section>
    </div>
  );
}
