import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, MapPin, GraduationCap, DollarSign, CheckCircle2, Bookmark, Share2 } from 'lucide-react';
import { useRole } from '../hooks/useRole';

import { supabase } from '../supabaseClient';

export default function ScholarshipDetail() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const { role } = useRole();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (scholarship) {
      const user = JSON.parse(localStorage.getItem('registeredUser') || 'null');
      const storageKey = user ? `savedScholarships_${user.id}` : 'savedScholarships';
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setIsBookmarked(saved.includes(scholarship.id));
    }
  }, [scholarship]);

  const toggleBookmark = () => {
    const user = JSON.parse(localStorage.getItem('registeredUser') || 'null');
    const storageKey = user ? `savedScholarships_${user.id}` : 'savedScholarships';
    let saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (saved.includes(scholarship.id)) {
      saved = saved.filter(savedId => savedId !== scholarship.id);
      setIsBookmarked(false);
    } else {
      saved.push(scholarship.id);
      setIsBookmarked(true);
    }
    localStorage.setItem(storageKey, JSON.stringify(saved));
  };

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const { data, error } = await supabase.from('scholarships').select('*').eq('id', id).single();
        if (error) throw error;
        // Map applyurl to applyUrl
        setScholarship({ ...data, applyUrl: data.applyurl });
      } catch (err) {
        console.error('Failed to fetch scholarship details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Memuat detail beasiswa...
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Beasiswa tidak ditemukan</h2>
        <Link to="/scholarships" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Kembali ke Daftar Beasiswa
        </Link>
      </div>
    );
  }

  const formattedDate = scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '-';

  const deadlineDate = scholarship.deadline ? new Date(scholarship.deadline) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (deadlineDate) deadlineDate.setHours(0, 0, 0, 0);
  const isClosed = deadlineDate ? (deadlineDate - today) < 0 : false;

  return (
    <div>
      {/* Header */}
      <div className="detail-header">
        <div className="container">
          <Link to="/scholarships" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            <ArrowLeft size={16} /> Kembali
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              {scholarship.category && <span className="card-tag">{scholarship.category}</span>}
              <h1 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1rem' }}>{scholarship.title}</h1>
              <div className="card-provider" style={{ fontSize: '1.25rem' }}>
                <Building size={20} />
                {scholarship.provider}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-outline"
                style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '999px', color: copied ? '#10b981' : 'var(--text-primary)', borderColor: copied ? '#10b981' : 'var(--border-color)', transition: 'all 0.2s' }}
                onClick={handleCopyLink}
              >
                <Share2 size={20} />
                {copied ? 'Tersalin!' : 'Bagikan'}
              </button>

              {role === 'applicant' && (
                <button 
                  className={isBookmarked ? 'btn btn-primary' : 'btn btn-outline'} 
                  style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: isBookmarked ? 'var(--accent-cyan)' : 'var(--bg-secondary)', color: isBookmarked ? 'white' : 'var(--text-primary)', borderColor: isBookmarked ? 'transparent' : 'var(--border-color)', borderRadius: '999px' }} 
                  onClick={toggleBookmark}
                >
                  <Bookmark size={20} fill={isBookmarked ? 'white' : 'none'} />
                  {isBookmarked ? 'Tersimpan' : 'Simpan Beasiswa'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content container">
        <div className="detail-grid">
          
          {/* Main Content */}
          <div className="main-info">
            <div className="content-section">
              <h2><GraduationCap size={24} /> Deskripsi</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{scholarship.description}</p>
            </div>

            {/* Optional Sections */}
            {scholarship.benefits && Array.isArray(scholarship.benefits) && scholarship.benefits.length > 0 && (
              <div className="content-section">
                <h2><DollarSign size={24} /> Keuntungan Beasiswa</h2>
                <ul>
                  {scholarship.benefits.map((ben, idx) => (
                    <li key={idx}>{ben}</li>
                  ))}
                </ul>
              </div>
            )}

            {scholarship.requirements && Array.isArray(scholarship.requirements) && scholarship.requirements.length > 0 && (
              <div className="content-section">
                <h2><CheckCircle2 size={24} /> Persyaratan</h2>
                <ul>
                  {scholarship.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {scholarship.documents && Array.isArray(scholarship.documents) && scholarship.documents.length > 0 && (
              <div className="content-section">
                <h2>Dokumen Dibutuhkan</h2>
                <ul>
                  {scholarship.documents.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {scholarship.tags && Array.isArray(scholarship.tags) && scholarship.tags.length > 0 && (
              <div className="content-section">
                <h2>Tag Beasiswa</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {scholarship.tags.map((tag, idx) => (
                    <span key={idx} style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '999px', border: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="info-card">
              <h3 style={{ fontSize: '1.5rem' }}>Informasi Penting</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--accent-cyan-light)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tenggat Waktu</div>
                    <div style={{ fontWeight: 600 }}>{formattedDate}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--accent-cyan-light)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Kategori</div>
                    <div style={{ fontWeight: 600 }}>{scholarship.category || '-'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--accent-cyan-light)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Penyelenggara</div>
                    <div style={{ fontWeight: 600 }}>{scholarship.provider || '-'}</div>
                  </div>
                </div>
              </div>

              <button 
                className={`btn ${isClosed ? 'btn-outline' : 'btn-primary'}`} 
                style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', opacity: isClosed ? 0.5 : 1, cursor: isClosed ? 'not-allowed' : 'pointer', borderColor: isClosed ? '#ef4444' : '', color: isClosed ? '#ef4444' : '' }} 
                disabled={isClosed}
                onClick={() => {
                  if (scholarship.applyUrl) {
                    window.open(scholarship.applyUrl.startsWith('http') ? scholarship.applyUrl : `https://${scholarship.applyUrl}`, '_blank');
                  } else {
                    alert('Link pendaftaran belum tersedia.');
                  }
                }}
              >
                {isClosed ? 'Pendaftaran Ditutup' : 'Daftar Sekarang'}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                *Akan diarahkan ke website resmi penyelenggara
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
