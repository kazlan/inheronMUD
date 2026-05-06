import React from 'react';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Map, Scroll, Sword } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="hub-container">
      {/* Navigation */}
      <nav className="hub-nav" style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 100, 
        padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(12, 14, 20, 0.8), transparent)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/ui/inheronmud_logo_horizontal_full.png" alt="InheronMUD" style={{ height: '40px' }} />
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 600 }}>
          <a href="#atlas" style={{ color: 'var(--text-bright)', textDecoration: 'none' }}>Atlas</a>
          <a href="#biblioteca" style={{ color: 'var(--text-bright)', textDecoration: 'none' }}>Biblioteca</a>
          <a href="#edictos" style={{ color: 'var(--text-bright)', textDecoration: 'none' }}>Edictos</a>
          <Link to="/play" style={{ color: 'var(--hub-gold)', textDecoration: 'none', border: '1px solid var(--hub-gold)', padding: '0.4rem 1rem', borderRadius: '2px' }}>Jugar Ahora</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hub-hero">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="hub-content"
          style={{ textAlign: 'center' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ marginBottom: '2rem', opacity: 0.6 }}
          >
            <Compass size={80} color="var(--hub-gold)" strokeWidth={1} />
          </motion.div>
          
          <h1 style={{ 
            fontFamily: 'var(--font-title)', 
            fontSize: '4rem', 
            color: 'var(--hub-gold-bright)', 
            textShadow: '0 0 30px rgba(197, 160, 89, 0.4)',
            marginBottom: '1rem',
            letterSpacing: '0.1em'
          }}>
            ERYNDOR
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-body)', 
            fontSize: '1.5rem', 
            color: 'var(--text-main)', 
            maxWidth: '700px', 
            margin: '0 auto 2.5rem',
            fontStyle: 'italic'
          }}>
            "La tierra que recuerda, el continente de los juramentos y las historias que se niegan a desaparecer."
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/play" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem' }}>
              <Sword size={18} />
              Despertar en Inheron
            </Link>
            <a href="#atlas" style={{ 
              color: 'var(--text-bright)', 
              textDecoration: 'none', 
              padding: '1rem 2.5rem', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s'
            }}>
              Explorar el Atlas
            </a>
          </div>
        </motion.div>

        {/* Floating Particles/Letters Effect */}
        <div className="white-ink-particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* We can add SVG or CSS particles here later */}
        </div>
      </section>

      {/* Atlas Section */}
      <section id="atlas" className="hub-section" style={{ background: '#0a0c12' }}>
        <div className="hub-content">
          <h2 className="ornate-title">El Atlas de Eryndor</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <motion.div whileHover={{ scale: 1.02 }} className="parchment-card">
              <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>Altherion</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', opacity: 0.8 }}>El Reino del Alba Serena. Hogar de caballeros solares y reliquias parlanchinas. Aquí es donde tu leyenda comienza.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="parchment-card">
              <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>Sombral</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', opacity: 0.8 }}>La frontera del Velo Roto. Un lugar donde la memoria se filtra y los sueños cobran forma física.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="parchment-card">
              <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>Bieluxmar</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', opacity: 0.8 }}>La República de las Mil Cartas. Un puerto donde se comercia con mapas de islas que no existían ayer.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biblioteca Section */}
      <section id="biblioteca" className="hub-section" style={{ background: '#05080f' }}>
        <div className="hub-content">
          <h2 className="ornate-title">La Gran Biblioteca</h2>
          <div style={{ display: 'flex', gap: '3rem', overflowX: 'auto', paddingBottom: '2rem' }}>
            {/* Comic Season 1 */}
            <div style={{ minWidth: '300px', flexShrink: 0 }}>
              <div style={{ 
                aspectRatio: '2/3', 
                background: 'linear-gradient(45deg, #1a1a1a, #2d2d2d)', 
                borderRadius: '4px', 
                marginBottom: '1rem',
                border: '1px solid var(--hub-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
              }}>
                <Sword color="var(--hub-gold)" size={48} style={{ opacity: 0.5 }} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--hub-gold)' }}>Temporada 1</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>El bardo que no debía ser recordado.</p>
            </div>
            {/* More placeholders */}
            <div style={{ minWidth: '300px', flexShrink: 0, opacity: 0.5 }}>
              <div style={{ 
                aspectRatio: '2/3', 
                background: '#1a1a1a', 
                borderRadius: '4px', 
                marginBottom: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Scroll size={48} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-title)' }}>Próximamente</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nuevas crónicas de Eryndor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Edictos Section */}
      <section id="edictos" className="hub-section" style={{ background: '#0c0e14' }}>
        <div className="hub-content">
          <h2 className="ornate-title">Edictos del Reino</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              borderLeft: '2px solid var(--hub-gold)', 
              paddingLeft: '2rem', 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '3rem'
            }}>
              <div className="update-item">
                <span style={{ 
                  position: 'absolute', left: '-11px', top: '0', 
                  width: '20px', height: '20px', background: 'var(--hub-bg)', 
                  border: '2px solid var(--hub-gold)', borderRadius: '50%' 
                }}></span>
                <h4 style={{ color: 'var(--hub-gold)', fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>v0.8.5 - La Apertura de Villaclara</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Implementación del sistema de autogestión de misiones y apertura del hub inicial para forasteros planares.</p>
              </div>
              <div className="update-item" style={{ opacity: 0.7 }}>
                <span style={{ 
                  position: 'absolute', left: '-11px', top: 'calc(100% + 1.5rem)', 
                  width: '20px', height: '20px', background: 'var(--hub-bg)', 
                  border: '2px solid rgba(197, 160, 89, 0.4)', borderRadius: '50%' 
                }}></span>
                <h4 style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>v0.8.0 - Forja de Almas</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Primeras pruebas de las habilidades resonantes y sincronización con las Corrientes Primarias.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: '#05080f' }}>
        <img src="/ui/inheronmud_logo_horizontal_full.png" alt="InheronMUD" style={{ height: '30px', opacity: 0.5, marginBottom: '1.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-ui)' }}>
          &copy; 2026 InheronMUD. Todos los derechos recordados.
        </p>
      </footer>
    </div>

  );
};

export default Landing;
