import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, LayoutGrid } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import { useRole } from '../hooks/useRole';
import { supabase } from '../supabaseClient';

export default function Scholarships() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState('all');

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [filterLevel, setFilterLevel] = useState('All');

  const prefs = JSON.parse(localStorage.getItem('userPreferences') || 'null');
  const targetLevel = prefs ? prefs.targetLevel : '';

  const [allScholarships, setAllScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    // Update local state when URL changes
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    // Fetch data from Supabase
    const fetchScholarships = async () => {
      try {
        const { data, error } = await supabase.from('scholarships').select('*');
        if (error) throw error;
        // Map applyurl to applyUrl to preserve frontend compatibility
        const formattedData = data.map(item => ({ ...item, applyUrl: item.applyurl }));
        setAllScholarships(formattedData);
        setFilteredScholarships(formattedData);
      } catch (err) {
        console.error('Failed to fetch scholarships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  useEffect(() => {
    // Filter logic
    let result = allScholarships;

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(s => {
        const title = s.title || '';
        const provider = s.provider || '';
        const desc = s.description || '';
        const type = s.type || s.category || '';
        return title.toLowerCase().includes(lowercasedSearch) ||
          provider.toLowerCase().includes(lowercasedSearch) ||
          desc.toLowerCase().includes(lowercasedSearch) ||
          type.toLowerCase().includes(lowercasedSearch);
      });
    }

    if (activeTab === 'recommended' && targetLevel) {
      result = result.filter(s => {
        const level = s.level || s.category || '';
        return level.toLowerCase().includes(targetLevel.toLowerCase());
      });
    } else if (activeTab === 'all' && filterLevel !== 'All') {
      result = result.filter(s => {
        const level = s.level || s.category || '';
        return level.toLowerCase().includes(filterLevel.toLowerCase());
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    result.sort((a, b) => {
      const dateA = new Date(a.deadline);
      dateA.setHours(0, 0, 0, 0);
      const diffA = Math.ceil((dateA - today) / (1000 * 60 * 60 * 24));

      const dateB = new Date(b.deadline);
      dateB.setHours(0, 0, 0, 0);
      const diffB = Math.ceil((dateB - today) / (1000 * 60 * 60 * 24));

      if (diffA < 0 && diffB >= 0) return 1;
      if (diffB < 0 && diffA >= 0) return -1;

      return diffA - diffB;
    });

    setFilteredScholarships(result);
    setCurrentPage(1);
  }, [searchTerm, filterLevel, allScholarships, activeTab, targetLevel]);

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  const currentItems = filteredScholarships.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 150px)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Eksplorasi <span className="text-gradient">Beasiswa</span></h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Temukan beasiswa yang sesuai dengan profil dan impian akademis Anda.
      </p>

      {role === 'applicant' && (
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <button
            onClick={() => { setActiveTab('all'); setFilterLevel('All'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', background: 'transparent', border: 'none', color: activeTab === 'all' ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontWeight: activeTab === 'all' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: activeTab === 'all' ? '3px solid var(--accent-cyan)' : '3px solid transparent', transition: 'all 0.2s', marginBottom: '-1px' }}
          >
            <LayoutGrid size={18} /> Semua Beasiswa
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', background: 'transparent', border: 'none', color: activeTab === 'recommended' ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontWeight: activeTab === 'recommended' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: activeTab === 'recommended' ? '3px solid var(--accent-cyan)' : '3px solid transparent', transition: 'all 0.2s', marginBottom: '-1px' }}
          >
            <Star size={18} /> Rekomendasi Untukmu
          </button>
        </div>
      )}

      {activeTab === 'recommended' && !targetLevel ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)' }}>
          <Star size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Rekomendasi Belum Aktif</h3>
          <p>Silakan lengkapi target beasiswa di Profil Anda untuk mendapatkan rekomendasi.</p>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => window.location.href = '/profile'}>
            Lengkapi Profil
          </button>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex" style={{ gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearchSubmit} className="search-container" style={{ margin: 0, flexGrow: 1, maxWidth: 'none' }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder={activeTab === 'recommended' ? `Cari di rekomendasi ${targetLevel}...` : "Cari nama beasiswa, instansi, atau tag..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {activeTab === 'all' && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)' }}>
                  <Filter size={18} />
                </div>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  style={{
                    appearance: 'none',
                    padding: '1rem 3rem 1rem 3rem',
                    borderRadius: '999px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="All">Semua Kategori</option>
                  <option value="D3">D3 (Diploma)</option>
                  <option value="D4">D4 (Diploma Terapan)</option>
                  <option value="S1">S1 (Sarjana)</option>
                  <option value="S2">S2 (Magister)</option>
                  <option value="S3">S3 (Doktoral)</option>
                  <option value="Postdoc">Postdoc</option>
                  <option value="Profesional">Profesional / Sertifikasi</option>
                </select>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
              Memuat data beasiswa...
            </div>
          ) : filteredScholarships.length > 0 ? (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Menampilkan {filteredScholarships.length} beasiswa
              </p>
              <div className="card-grid">
                {currentItems.map(scholarship => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1rem', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Sebelumnya
                  </button>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1rem', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tidak ada beasiswa ditemukan</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Coba gunakan kata kunci lain atau ubah filter jenjang.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => {
                  setSearchTerm('');
                  setFilterLevel('All');
                  setSearchParams({});
                }}
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
