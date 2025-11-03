import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <header className="hero">
        <h1>SwargaYatra</h1>
        <p className="tagline">Dignified farewells in Bangalore, 24?7 support</p>
        <div className="cta">
          <Link href="/ad" className="button">View Video Ad</Link>
          <a href="tel:+919999999999" className="button secondary">Call 24?7: +91 99999 99999</a>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h3>Complete Cremation Support</h3>
          <p>Rituals, priests, hearse van, permits?handled with care and respect.</p>
        </div>
        <div className="card">
          <h3>Pan-Bangalore Coverage</h3>
          <p>Rapid response across all neighborhoods and major hospitals.</p>
        </div>
        <div className="card">
          <h3>Transparent Pricing</h3>
          <p>No hidden charges. Clear plans to meet every family?s needs.</p>
        </div>
        <div className="card">
          <h3>24?7 Compassionate Team</h3>
          <p>Guidance end-to-end, from paperwork to ceremonies.</p>
        </div>
      </section>

      <footer className="footer">
        <p>Bangalore, Karnataka ? SwargaYatra ? {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
