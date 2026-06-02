import { Search, Compass } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ScholarshipCard from '../components/ScholarshipCard';

import { supabase } from '../supabaseClient';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/scholarships?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase.from('scholarships').select('*').limit(3);
        if (error) throw error;
        const formattedData = data.map(item => ({ ...item, applyUrl: item.applyurl }));
        setFeaturedScholarships(formattedData);
      } catch (e) {
        console.error('Failed to fetch scholarships', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="animate-fade-in">
            Raih Masa Depanmu dengan <br/>
            <span className="text-gradient">Beasiswa Impian</span>
          </h1>
          <p className="animate-fade-in delay-100">
            Temukan ratusan peluang beasiswa dari dalam dan luar negeri. Kami membantu Anda mempermudah proses pencarian dan mewujudkan cita-cita.
          </p>
          
          <form onSubmit={handleSearch} className="search-container animate-fade-in delay-200">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari beasiswa (misal: S2, LPDP, Luar Negeri)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', padding: '0.5rem 1.5rem', height: 'calc(100% - 1rem)' }}>
              Cari
            </button>
          </form>

          <div className="flex justify-center gap-4 animate-fade-in delay-300" style={{ marginTop: '2rem' }}>
            <Link to="/scholarships" className="btn btn-primary">
              Eksplorasi Semua Beasiswa
            </Link>
            <a href="#featured" className="btn btn-outline">
              <Compass size={18} /> Beasiswa Populer
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Beasiswa <span className="text-cyan">Terpopuler</span></h2>
            <Link to="/scholarships" className="text-cyan" style={{ fontWeight: 600 }}>Lihat Semua →</Link>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Memuat beasiswa...</div>
          ) : (
            <div className="card-grid">
              {featuredScholarships.map(scholarship => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats/Info Section */}
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Kenapa Menggunakan <span className="text-gradient">BeaSIte</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Platform kami dirancang khusus untuk memudahkan perjalanan Anda menuju pendidikan impian tanpa harus khawatir tentang biaya.
          </p>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { number: '50+', text: 'Penyedia Beasiswa' },
              { number: '100+', text: 'Program Tersedia' },
              { number: '10k+', text: 'Pengguna Aktif' }
            ].map((stat, index) => (
              <div key={index} style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <h3 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stat.number}</h3>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
