import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Map, Scroll, Sword, ArrowRight, Sun, Leaf, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="hub-container light-theme" style={{ background: '#fdfbf7', overflow: 'hidden', color: '#2b2620' }}>
      {/* Dynamic Background */}
      <div className="hub-bg-anim-light" />

      {/* Navigation - Glassmorphism Light */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          {/* Reusing logo but adding brightness/contrast to make it pop on light bg */}
          <img src="/ui/inheronmud_logo_horizontal_full.png" alt="InheronMUD" style={{ height: '35px', filter: 'brightness(0.6) sepia(1) hue-rotate(-20deg) saturate(2)' }} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', gap: '2.5rem', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.8rem', fontWeight: 700, alignItems: 'center' }}
        >
          <a href="#altherion" className="nav-link-light">Altherion</a>
          <a href="#biblioteca" className="nav-link-light">Códice</a>
          <a href="#edictos" className="nav-link-light">Edictos</a>
          <Link to="/play" className="play-nav-btn-light">
            <Sword size={16} /> Jugar Ahora
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, textAlign: 'center', zIndex: 10, padding: '0 2rem' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff9e6', padding: '0.4rem 1.2rem', borderRadius: '100px', border: '1px solid #e5c07b', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(229, 192, 123, 0.3)' }}>
              <Sun size={16} color="#d97706" />
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b45309', fontWeight: 'bold' }}>El Alba Ha Despertado</span>
            </div>
            
            <h1 className="hero-title-light">
              ALTHERION
            </h1>
            <p className="hero-subtitle-light">
              Respira la brisa matinal cargada de magia antigua. Siente la calidez de un sol que nunca olvida. 
              Cruza el Velo hacia un reino jovial de maravillas constantes, donde cada uno de tus pasos teje una nueva y vibrante leyenda.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '3rem' }}>
              <Link to="/play" className="btn-epic-light">
                <span className="btn-epic-content-light">
                  Llegar a Villaclara <ArrowRight size={18} />
                </span>
                <div className="btn-epic-glow-light" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Atlas Section - Altherion Focus */}
      <section id="altherion" style={{ padding: '8rem 2rem', position: 'relative', zIndex: 20, background: '#ffffff', borderTop: '2px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            <Sun size={40} color="#d97706" style={{ marginBottom: '1rem' }} />
            <h2 className="section-title-light">Los Dominios de Altherion</h2>
            <div className="title-separator-light" />
            <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
              Un reino bañado por la luz perpetua de los Siete Soles, repleto de misterios coloridos, magia resonante y caminos empedrados en oro viejo.
            </p>
          </motion.div>

          <div className="cards-grid-light">
            {[
              { title: 'La Plaza de Villaclara', desc: 'Siente el bullicio jovial del mercado y el fresco sabor a manzanas recién horneadas. El tintineo de monedas y las risas marcan el inicio de toda gran aventura.', icon: <Sun size={28}/>, color: '#d97706', bg: '#fffbeb' },
              { title: 'El Bosque Susurrante', desc: 'Acaricia el musgo esmeralda y respira el rocío dulce de las hojas eternas. Escucha atentamente: los árboles aquí cantan antiguas coplas de héroes olvidos.', icon: <Leaf size={28}/>, color: '#059669', bg: '#ecfdf5' },
              { title: 'La Forja del Alba', desc: 'El calor reconfortante acaricia tus mejillas mientras el olor a hierro al rojo inunda el ambiente. El martilleo rítmico compone la banda sonora del progreso.', icon: <Flame size={28}/>, color: '#dc2626', bg: '#fef2f2' }
            ].map((realm, i) => (
              <motion.div 
                key={realm.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="renaissance-card-light"
                style={{ backgroundColor: realm.bg }}
              >
                <div className="card-icon-light" style={{ color: realm.color, borderColor: realm.color, background: '#ffffff' }}>
                  {realm.icon}
                </div>
                <h3 style={{ color: realm.color }}>{realm.title}</h3>
                <p>{realm.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Biblioteca Section */}
      <section id="biblioteca" style={{ padding: '8rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
          >
            <div>
              <h2 className="section-title-light" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>El Códice Radiante</h2>
              <p style={{ color: '#64748b', fontFamily: 'var(--font-body)', fontSize: '1.2rem', maxWidth: '600px' }}>
                Conoce las maravillas mecánicas, las coloridas tradiciones y el lore tejido por el alegre pueblo de Altherion.
              </p>
            </div>
            <button className="btn-outline-light">Leer el Códice</button>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="codex-featured-light"
            >
              <div className="codex-content-light">
                <span className="codex-tag-light">Guía de Clase</span>
                <h3>El Bardo de Crónica Viva</h3>
                <p>Aprende a desatar la alegría de las Armonías, gasta Voz en cánticos vibrantes y cambia el ritmo del combate con una sola nota.</p>
                <span className="read-more-light">Leer documento <ArrowRight size={14} /></span>
              </div>
            </motion.div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.div whileHover={{ x: 10 }} className="codex-row-light">
                <div className="codex-row-icon-light"><BookOpen size={20} /></div>
                <div>
                  <h4>Progresión Brillante</h4>
                  <p>Avanza del nivel 1 al 60 y descubre tu vocación.</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} className="codex-row-light">
                <div className="codex-row-icon-light"><Map size={20} /></div>
                <div>
                  <h4>Guía de Villaclara</h4>
                  <p>Lugares de interés, mercaderes amigables y atajos soleados.</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ x: 10 }} className="codex-row-light">
                <div className="codex-row-icon-light"><Scroll size={20} /></div>
                <div>
                  <h4>Autodocumentación</h4>
                  <p>Usa el comando 'ayuda' y navega por el mundo de forma fácil.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <img src="/ui/inheronmud_logo_horizontal_full.png" alt="InheronMUD" style={{ height: '30px', filter: 'brightness(0.6) sepia(1) hue-rotate(-20deg) saturate(2)', opacity: 0.6, marginBottom: '2rem' }} />
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em' }}>
          &copy; 2026 INHERON MUD. DESPIERTA EN LA LUZ.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
